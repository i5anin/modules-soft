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
            $manager = $request->query('manager'); // получаем менеджера

            $ordersSql = file_get_contents(database_path('sql/getOrdersData.sql'));
            $countSql = file_get_contents(database_path('sql/getOrdersDataCount.sql'));

            $parameters = [
                'limit' => $limit,
                'offset' => $offset,
            ];

            $countParameters = [];

            if ($search) {
                $searchCondition = "AND ("
                    ."orders.id::text ILIKE :search OR "
                    ."clients.name ILIKE :search)";
                $ordersSql = str_replace('-- SEARCH_CONDITION', $searchCondition, $ordersSql);
                $countSql = str_replace('-- SEARCH_CONDITION', $searchCondition, $countSql);
                $parameters['search'] = "%$search%";
                $countParameters['search'] = "%$search%";
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
