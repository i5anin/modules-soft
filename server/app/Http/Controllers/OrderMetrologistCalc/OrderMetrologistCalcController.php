<?php

namespace App\Http\Controllers\OrderMetrologistCalc;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderMetrologistCalcController extends Controller
{
    public function getOrdersData(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $perPage = $request->input('per_page', 10);

        // 1. Load the SQL from the file
        $sql = file_get_contents(database_path('sql\getOrdersData.sql'));

        // 2. Build dynamic WHERE clause
        if ($dateFrom && $dateTo) {
            $sql .= " AND o.date BETWEEN ? AND ? ";
        }

        // 3. Calculate offset for pagination
        $offset = ($request->input('page', 1) - 1) * $perPage;

        // 4. Add LIMIT and OFFSET for pagination
        $sql .= " LIMIT {$perPage} OFFSET {$offset}";

        $bindings = [];
        if ($dateFrom && $dateTo) {
            $bindings[] = $dateFrom;
            $bindings[] = $dateTo;
        }

        $allOrders = DB::select(DB::raw($sql), $bindings);
        $total = count($allOrders); // Assuming you are not retrieving a massive dataset

        $orders = new LengthAwarePaginator(
            $allOrders,
            $total,
            $perPage,
            $request->input('page', 1),
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return response()->json(['orders' => $orders]);
    }
}
