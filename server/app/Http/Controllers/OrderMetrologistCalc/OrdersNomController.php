<?php

namespace App\Http\Controllers\OrderMetrologistCalc;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdersNomController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/orders_nom_list",
     *     summary="Получить список номенклатуры для заказа",
     *     description="Возвращает информацию о заказе и номенклатуре в заказе, с возможностью поиска по имени, описанию и ID номенклатуры.",
     *     tags={"Cписок номенклатуры для заказа"},
     *     @OA\Parameter(
     *         name="order_id",
     *         in="query",
     *         description="ID заказа",
     *         required=true,
     *         @OA\Schema(
     *             type="integer"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="search_string",
     *         in="query",
     *         description="Строка поиска для фильтрации по имени, описанию или ID номенклатуры",
     *         required=false,
     *         @OA\Schema(
     *             type="string"
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="header",
     *                 type="object",
     *                 description="Информация о заказе",
     *                 @OA\Property(property="order_id", type="integer", description="ID заказа"),
     *                 @OA\Property(property="order_date", type="string", description="Дата заказа"),
     *                 @OA\Property(property="order_manager", type="string", description="Менеджер заказа"),
     *                 @OA\Property(property="client_name", type="string", description="Имя клиента"),
     *                 @OA\Property(property="contact", type="string", description="Контактное лицо"),
     *                 @OA\Property(property="tech_fio", type="string", description="Технический ответственный"),
     *                 @OA\Property(property="metall_buy_time", type="integer", description="Срок покупки металла"),
     *                 @OA\Property(property="comments", type="string", description="Комментарии к заказу"),
     *                 @OA\Property(property="omts_comments", type="string", description="Комментарии ОМТС"),
     *                 @OA\Property(property="st_price", type="integer", description="Стоимость стандартных изделий в заказе"),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибка валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="validation_errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function getOrderNomList(Request $request): JsonResponse
    {
        try {
            // Получаем параметры из запроса
            $parameters = $request->validate([
                'order_id' => 'required|numeric',
                'search_string' => 'nullable|string',
            ]);

            // Загружаем SQL запрос из файла
            $sql = file_get_contents(database_path('sql/orderNomList.sql'));

            $search_string = $parameters['search_string'] ?? null;

            // Обработка фильтра order_nom_id
            if ($search_string) {
                $orders_nom_sql = ", CASE WHEN (ordersnom.name ILIKE '%' || :search_string || '%'
                                   OR ordersnom.description ILIKE '%' || :search_string || '%'
                                   OR ordersnom.id::VARCHAR ILIKE '%' || :search_string || '%')
                              THEN TRUE ELSE FALSE END AS search";
                $sql = str_replace('---SEARCH', $orders_nom_sql, $sql);
            } else {
                $sql = str_replace('---SEARCH', '', $sql);
            }

            // Выполнение запроса с подстановкой параметров
            $results = DB::select($sql, $parameters);

            if (count($results) > 0) {
                // Извлекаем общие поля из первой записи
                $header = [
                    'order_id' => $results[0]->order_id,
                    'order_date' => $results[0]->order_date,
                    'order_manager' => $results[0]->order_manager,
                    'client_name' => $results[0]->client_name,
                    'contact' => $results[0]->contact,
                    'tech_fio' => $results[0]->tech_fio,
                    'metall_buy_time' => $results[0]->metall_buy_time,
                    'comments' => $results[0]->comments,
                    'omts_comments' => $results[0]->omts_comments,
                    'st_price' => $results[0]->st_price,
                ];

                // Создаем массив для таблицы номенклатур, убирая из каждой записи поля, которые есть в хедере
                $nomtable = array_map(function($row) use ($header) {
                    return array_diff_key((array)$row, $header);
                }, $results);

                // Возвращаем ответ
                return response()->json([
                    'header' => $header,
                    'nomtable' => $nomtable,
                ]);
            }

        } catch (ValidationException $e) {
            // Возврат ошибок валидации
            return response()->json(['validation_errors' => $e->errors()], 422);
        } catch (QueryException $e) {
            // Возврат ошибки базы данных
            return response()->json(['db_error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            // Общая обработка исключений
            return response()->json(['error' => $e->getMessage()], 500);
        }

        // Возвращаем ответ
        return response()->json([
            'header' => $header ?? [],
            'nomtable' => $nomtable ?? [],
        ]);
    }
}
