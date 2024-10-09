<?php
/**
 * @OA\Info(
 *     title="Информация о номенклатуре в заказе API",
 *     version="1.0.0",
 *     description="API для вывода информации о номенклатуры в заказе."
 * )
 */

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class OrderNomInfoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/order_nom_info",
     *     summary="Получение информации о номенклатуре в заказе (ОМТС)",
     *     description="Возвращает информацию о номенклатуре по ID и выполняет перерасчет при необходимости (ОМТС)",
     *     tags={"Информация по номенлатуре в заказе"},
     *     @OA\Parameter(
     *         name="orders_nom_id",
     *         in="query",
     *         required=true,
     *         description="ID номенклатуры заказа",
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="recalc",
     *         in="query",
     *         required=false,
     *         description="Флаг перерасчета данных",
     *         @OA\Schema(
     *             type="integer",
     *             enum={0, 1},
     *             default=0
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="object",
     *             example={
     *                 "orders_nom_id": 123,
     *                 "zag_type": "Отливка",
     *                 "profile": "Квадрат",
     *                 "zag_buy_p1": 12,
     *                 "zag_buy_weight": 50.5,
     *                 "metall_price": 1000,
     *                 "metall_price_total_det": 1500,
     *                 "logistics_price_per_det": 200
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             type="object",
     *             example={"validation_errors": "Некорректные данные"}
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             type="object",
     *             example={"error": "Ошибка выполнения запроса"}
     *         )
     *     )
     * )
     */
    public function view(Request $request): JsonResponse
    {
        try {
            $ordersNomId = $request->input('orders_nom_id');
            $recalc = $request->input('recalc');

            $sql = file_get_contents(database_path('sql/orderNomInfo.sql'));

            // Выполняем параметризованный запрос
            $results = DB::select($sql, ['orders_nom_id' => $ordersNomId]);

            // Проверяем, есть ли результаты
            if (empty($results)) {
                return response()->json(['error' => 'No results found'], 404);
            }

            $nom = (array)$results[0];
            $nom['recalc'] = $recalc;

            if (!($nom['zag_type'] === "Отливка" || $nom['zag_type'] === "Литье") && $recalc == 1) {
                $updatedNom = $this->ReCalc($nom);
                $results[0] = (object)array_merge($nom, $updatedNom);
            }

        } catch (ValidationException $e) {
            return response()->json(['validation_errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['db_error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return response()->json($nom);
    }

    /**
     * @OA\Schema(
     *     schema="NomData",
     *     type="object",
     *     required={"zag_type", "profile"},
     *     @OA\Property(property="zag_type", type="string", description="Тип заготовки"),
     *     @OA\Property(property="profile", type="string", description="Тип профиля"),
     *     @OA\Property(property="zag_buy_p1", type="number", description="Длина заготовки"),
     *     @OA\Property(property="zag_buy_weight", type="number", description="Вес заготовки"),
     *     @OA\Property(property="metall_price", type="number", description="Цена металла"),
     *     @OA\Property(property="metall_price_total_det", type="number", description="Общая цена на деталь"),
     *     @OA\Property(property="logistics_price_per_det", type="number", description="Логистическая цена за деталь")
     * )
     */
    private function ReCalc(array $nom): array
    {
        try {
            $nom['zag_buy_p1'] = $nom['zag_tech_p1'];
            switch ($nom['profile']) {
                case "Квадрат":
                case "Круг":
                case "п/б Круг":
                case "Шестигранник":
                    $nom['zag_buy_p2'] = $this->addLength($nom['zag_tech_p2'], $nom['zag_tech_p1']);
                    break;
                case "Лист":
                    $nom['zag_buy_p2'] = $nom['zag_tech_p2'] + 10;
                    $nom['zag_buy_p3'] = $nom['zag_tech_p3'] + 5;
                    break;
                case "Труба круглая":
                case "п/б Труба круглая":
                    $nom['zag_buy_p3'] = $this->addLength($nom['zag_tech_p3'], $nom['zag_tech_p1']);
                    break;
                case "Труба профильная":
                case "Уголок":
                    $nom['zag_buy_p4'] = $this->addLength($nom['zag_tech_p4'], $nom['zag_tech_p1']);
                    break;
            }

            if ($nom['zag_buy_weight'] == 0 || $nom['recalc'] == 1) {
                $nom['zag_buy_material_id'] = $nom['zag_tech_material_id'];
                $matCalcController = new MatCalcController();
                $requestCalc = new Request($nom);
                $responseWeight = $matCalcController->calcWeight($requestCalc);
                $responseSectionArea = $matCalcController->calcSectionArea($requestCalc);
                $weight = $responseWeight->getData(true)['zag_buy_weight'];
                $sectionArea = $responseSectionArea->getData(true)['section_area'];

                $calcParams = new Request([
                    'zagType' => $nom['zag_type'],
                    'kolvo' => $nom['kolvo'],
                    'kolvoDetIzZag' => $nom['kolvo_det_iz_zag'] ?? 1,
                    'kolvoAdd' => $nom['kolvo_add'],
                    'logisticsPriceKg' => $nom['logistics_price_kg'],
                    'profile' => $nom['profile'],
                    'p1' => $nom['zag_buy_p1'],
                    'p2' => $nom['zag_buy_p2'] ?? 0,
                    'p3' => $nom['zag_buy_p3'] ?? null,
                    'p4' => $nom['zag_buy_p4'] ?? null,
                    'zag_buy_material_id' => $nom['zag_buy_material_id'],
                    'density' => $nom['zag_tech_density'],
                    'kgPrice' => $nom['metall_price_kg'] ?? 0,
                    'weight' => $weight,
                    'material' => $nom['material'] ?? '',
                    'ordersnom_id' => $nom['id'] ?? '',
                    'section_area' => $sectionArea,
                ]);

                $matPriceController = new PricesCalcController();
                $responsePrice = $matPriceController->Calc($calcParams);
                $data = $responsePrice->getData(true);
                $matPriceAdd = $data['matPriceAdd'] ?? 0;
                $logisticPricePerDet = $data['logisticPricePerDet'] ?? 0;
                $matPrice = $data['matPrice'] ?? 0;
                $zagKolvo = $data['zagKolvo'] ?? 0;
                $detPrice = $data['detPrice'] ?? 0;
                $nom['zag_buy_weight'] = $weight;
                $nom['metall_price_add'] = $matPriceAdd;
                $nom['logistics_price_per_det'] = $logisticPricePerDet;
                $nom['metall_price'] = $matPrice;
                $nom['zag_kolvo'] = $zagKolvo;
                $nom['metall_price_total_det'] = $detPrice;
            }

        } catch (ValidationException $e) {
            return response()->json(['validation_errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            return response()->json(['db_error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return $nom;
    }

    private function addLength($l, $d)
    {
        if ($d >= 0 && $d <= 100) {
            $add = 3;
        } elseif ($d >= 101 && $d <= 200) {
            $add = 4;
        } else {
            $add = 5;
        }
        return $l + $add;
    }
}
