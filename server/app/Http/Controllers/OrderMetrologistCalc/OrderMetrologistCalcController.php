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

            $sql = file_get_contents(database_path('sql\getOrdersData.sql'));
            $countSql = file_get_contents(database_path('sql\getOrdersDataCount.sql')); // Новый SQL для подсчета

            if ($search) {
                $searchSQL = "AND (orders.id::text ILIKE :search OR clients.name ILIKE :search)";
                $sql = str_replace('-- SEARCH_CONDITION', $searchSQL, $sql);
                $countSql = str_replace('-- SEARCH_CONDITION', $searchSQL, $countSql); // Добавляем условие поиска в countSql
            } else {
                $sql = str_replace('-- SEARCH_CONDITION', '', $sql);
                $countSql = str_replace('-- SEARCH_CONDITION', '', $countSql);
            }

            $parameters = [
                'limit' => $limit,
                'offset' => $offset
            ];

            if ($search) {
                $parameters['search'] = "%{$search}%";
            }

            $orders = DB::select($sql, $parameters);

// Параметры только для поиска, если он есть
            $countParameters = $search ? ['search' => $parameters['search']] : [];

            $totalCountResult = DB::selectOne($countSql, $countParameters);
            $totalCount = $totalCountResult->total_count;

            return response()->json([
                'currentPage' => $page,
                'itemsPerPage' => $limit,
                'totalCount' => $totalCount, // Добавляем totalCount в ответ
                'orders' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
