<?php

namespace App\Http\Controllers\OrderMetrologistCalc;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdersMetrologController extends Controller
{
    public function getOrdersData(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search');
            $page = (int)($request->query('page') ?? 1);
            $limit = (int)($request->query('limit') ?? 15);
            $offset = ($page - 1) * $limit;

            $ordersSql = file_get_contents(database_path('sql/getOrdersNomList.sql'));
//            $countSql = file_get_contents(database_path('sql/getOrdersDataCount.sql'));

            $parameters = [
                'limit' => $limit,
                'offset' => $offset,
            ];

            $countParameters = [];

            // Проверка и добавление фильтра поиска
            if ($search) {
                $searchValue = '%' . $search . '%';
                $searchCondition = "
                    AND (orders.id::text ILIKE :search
                    OR orders.order_manager ILIKE :search
                    OR clients.name ILIKE :search
                    OR mats.name ILIKE :search
                    OR ordersnom.name ILIKE :search
                    OR ordersnom.description ILIKE :search
                    OR calibres.name ILIKE :search
                    OR parameter ILIKE :search
                    OR quality ILIKE :search
                    OR TO_CHAR(date,'dd.mm.yyyy') ILIKE :search
                    )
                ";

                $ordersSql = str_replace('-- SEARCH_CONDITION', $searchCondition, $ordersSql);
//                $countSql = str_replace('-- SEARCH_CONDITION', $searchCondition, $countSql);


                $parameters['search'] = $searchValue;
                $countParameters['search'] = $searchValue;
            }

            $orders = DB::select($ordersSql, $parameters);
//            $totalCountResult = DB::selectOne($countSql, $countParameters);
//            $totalCount = $totalCountResult->total_count;

            // Извлечение общего количества записей из первого элемента результата
            $totalCount = !empty($orders) ? $orders[0]->total_count : 0;

            return response()->json([
                'currentPage' => $page,
                'itemsPerPage' => $limit,
                'totalCount' => $totalCount,
                'orders' => $orders
            ]);


        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getOrderData(Request $request): JsonResponse
    {
        try {
            // Получаем параметры из запроса
            $parameters = $request->validate([
                'order_id' => 'required|numeric',
                'search_string' => 'nullable|string',
            ]);

            // Загружаем SQL запрос из файла
            $sql = file_get_contents(database_path('sql/getOrderNomList.sql'));

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
                    'max_cal_buy_time' => $results[0]->max_cal_buy_time, //  перенесено

                    // Информация о клиенте
                    'client_name' => $results[0]->client_name,
                    'contact' => $results[0]->contact,

                    // Ответственные лица
                    'order_manager' => $results[0]->order_manager,
                    'tech_fio' => $results[0]->tech_fio,

                    // Финансовая информация
                    'total_cal_price' => $results[0]->total_cal_price,
                    'st_price' => $results[0]->st_price,

                    // Комментарии
                    'comments' => $results[0]->comments,
                    'omts_comments' => $results[0]->omts_comments,
                ];

                // Создаем массив для таблицы номенклатур, убирая из каждой записи поля, которые есть в хедере
                $nomtable = array_map(function ($row) use ($header) {
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
