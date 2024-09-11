<?php

namespace App\Http\Controllers\OrderMetrologistCalc;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderMetrologistCalcController extends Controller
{
    public function getOrdersData(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search');
            $page = (int)($request->query('page') ?? 1);
            $limit = (int)($request->query('limit') ?? 15);
            $offset = ($page - 1) * $limit;

            $ordersSql = file_get_contents(database_path('sql/getOrdersData.sql'));
            $countSql = file_get_contents(database_path('sql/getOrdersDataCount.sql'));

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
                    OR UPPER(calibres.name) LIKE :search
                    OR UPPER(parameter) LIKE :search
                    OR UPPER(quality) LIKE :search)
                ";

                $ordersSql = str_replace('-- SEARCH_CONDITION', $searchCondition, $ordersSql);
                $countSql = str_replace('-- SEARCH_CONDITION', $searchCondition, $countSql);

                $parameters['search'] = $searchValue;
                $countParameters['search'] = $searchValue;
            }

            $orders = DB::select($ordersSql, $parameters);
            $totalCountResult = DB::selectOne($countSql, $countParameters);
            $totalCount = $totalCountResult->total_count;

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
}
