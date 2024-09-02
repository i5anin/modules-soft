<?php

namespace App\Http\Controllers\OrderMetrologistCalc;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;


class OrderMetrologistCalcController extends Controller
{
    public function getOrdersData(Request $request): JsonResponse
    {
        try {
            $params = $request->query(); // Используем $request->query() для параметров GET
            $search = $params['search'] ?? null;
            $page = (int)($params['page'] ?? 1);
            $limit = (int)($params['limit'] ?? 15);
            $offset = ($page - 1) * $limit;

            $sql = file_get_contents(database_path('sql/ordersList.sql'));
            $bindings = [];

            // Search Filtering
            if ($search) {
                $sql .= " AND (orders.id::text ILIKE ? OR clients.name ILIKE ?)";
                $bindings[] = "%$search%";
                $bindings[] = "%$search%";
            }

            // Count total results before applying LIMIT/OFFSET
            $totalResultsSql = preg_replace('/LIMIT\s+\d+\s+OFFSET\s+\d+/i', '', $sql);
            $totalResults = count(DB::select(DB::raw($totalResultsSql), $bindings));

            // Apply LIMIT/OFFSET for pagination
            $sql .= " LIMIT {$limit} OFFSET {$offset}";

            $orders = DB::select(DB::raw($sql), $bindings);

            // Create Paginator
            $paginator = new LengthAwarePaginator($orders, $totalResults, $limit, $page, [
                'path' => $request->url(),
                'query' => $request->query(),
            ]);

            return response()->json([
                'currentPage' => $paginator->currentPage(),
                'itemsPerPage' => $paginator->perPage(),
                'totalCount' => $paginator->total(),
                'orders' => $paginator->items()
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Ошибка при получении информации о заказах'], 500);
        }
    }
}
