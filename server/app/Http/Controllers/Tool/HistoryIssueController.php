<?php

namespace App\Http\Controllers\Tool;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HistoryIssueController extends Controller
{
    public function getToolHistory(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $page = $request->query('page', 1);
            $limit = $request->query('limit', 15);
            $offset = ($page - 1) * $limit;
            $search = $request->query('search');
            $date = $request->query('date');
            $toolId = $request->query('toolId');
            $showArchive = $request->query('showArchive') === 'true';

            $where = ['TRUE'];

            if ($search) {
                $where[] = DB::raw(
                    "specs_nom.ID::text LIKE '%$search%' OR
                    UPPER(specs_nom.NAME) LIKE UPPER('%$search%') OR
                    UPPER(specs_nom.description) LIKE UPPER('%$search%')"
                );
            }

            if ($date) {
                $where[] = DB::raw("CAST(tool_history_nom.timestamp AS DATE) = CAST('$date' AS DATE)");
            }

            $where[] = DB::raw('T OR tf OR f OR f4 OR fg OR dmc OR hision');

            if ($toolId) {
                $where[] = DB::raw("tool_history_nom.id_tool = $toolId");
            }

            if ($showArchive) {
                $where[] = DB::raw(
                    "tool_part_archive.specs_nom_id IS NOT NULL AND tool_part_archive.archive IS TRUE"
                );
            } else {
                $where[] = DB::raw(
                    "tool_part_archive.specs_nom_id IS NULL OR tool_part_archive.archive IS FALSE"
                );
            }

            $toolsHistory = DB::table('specs_nom')
                ->select(
                    'specs_nom.ID as id_part',
                    'specs_nom.NAME',
                    'specs_nom.description',
                    DB::raw('COALESCE(SUM(tool_history_nom.quantity), 0) AS quantity_tool'),
                    DB::raw('COUNT(DISTINCT specs_nom_operations.ID) AS operation_count'),
                    DB::raw('COUNT(DISTINCT specs_nom_operations.ID) FILTER (WHERE specs_nom_operations.status_ready) AS ready_count'),
                    DB::raw('MIN(tool_history_nom.TIMESTAMP) AS first_issue_date'),
                    DB::raw('CAST(dbo.kolvo_prod_ready(specs_nom.ID) AS INTEGER) AS quantity_prod'),
                    'specs_nom.kolvo as quantity_prod_all',
                    'specs_nom.status_otgruzka',
                    'tool_part_archive.archive as is_archive',
                    DB::raw('COUNT(*) OVER () AS total_count') // Подсчет общего количества записей
                )
                ->join('specs_nom_operations', 'specs_nom.ID', '=', 'specs_nom_operations.specs_nom_id')
                ->join('operations_ordersnom', 'operations_ordersnom.op_id', '=', 'specs_nom_operations.ordersnom_op_id')
                ->leftJoin('tool_history_nom', 'specs_nom_operations.ID', '=', 'tool_history_nom.specs_op_id')
                ->leftJoin('tool_part_archive', 'specs_nom.ID', '=', 'tool_part_archive.specs_nom_id')
                ->whereRaw(implode(' AND ', $where))
                ->groupBy('specs_nom.ID', 'specs_nom.NAME', 'specs_nom.description', 'specs_nom.status_otgruzka', 'tool_part_archive.archive')
                ->havingRaw('COALESCE(SUM(tool_history_nom.quantity), 0) > 0')
                ->orderByRaw('MIN(tool_history_nom.TIMESTAMP) DESC')
                ->limit($limit)
                ->offset($offset)
                ->get();

            $totalCount = $toolsHistory->isNotEmpty() ? $toolsHistory->first()->total_count : 0;

            $toolsHistory = $toolsHistory->map(function ($item) {
                return [
                    'id_part' => $item->id_part,
                    'name' => $item->NAME,
                    'description' => $item->description,
                    'quantity_tool' => $item->quantity_tool,
                    'operation_count' => $item->operation_count,
                    'ready_count' => $item->ready_count,
                    'first_issue_date' => $item->first_issue_date ? Carbon::parse($item->first_issue_date)->format('Y-m-d') : null,
                    'quantity_prod' => $item->quantity_prod,
                    'quantity_prod_all' => $item->quantity_prod_all,
                    'status_ready' => $item->ready_count === $item->operation_count,
                    'status_otgruzka' => $item->status_otgruzka,
                    'is_archive' => $item->is_archive,
                ];
            });

            return response()->json([
                'currentPage' => $page,
                'itemsPerPage' => $limit,
                'totalCount' => $totalCount,
                'toolsHistory' => $toolsHistory,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при выполнении запроса'], 500);
        }
    }

    public function getToolHistoryId($id): \Illuminate\Http\JsonResponse
    {
        try {
            $history = DB::table('tool_history_nom as thn')
                ->select(
                    'sn.NAME',
                    'sn.description',
                    'oon.no as no_oper',
                    DB::raw('dbo.get_full_cnc_type(dbo.get_op_type_code(sno.ID)) AS type_oper'),
                    'sno.id as specs_op_id',
                    'sn.ID',
                    'thn.quantity',
                    'thn.id_user',
                    'thn.id_tool',
                    'thn.timestamp as date',
                    'o.fio as user_fio',
                    'tn.name as name_tool',
                    'tn.property'
                )
                ->leftJoin('specs_nom_operations as sno', 'thn.specs_op_id', '=', 'sno.id')
                ->leftJoin('specs_nom as sn', 'sno.specs_nom_id', '=', 'sn.id')
                ->leftJoin('operations_ordersnom as oon', 'oon.op_id', '=', 'sno.ordersnom_op_id')
                ->leftJoin('operators as o', 'thn.id_user', '=', 'o.id')
                ->leftJoin('tool_nom as tn', 'thn.id_tool', '=', 'tn.id')
                ->where('thn.specs_op_id', $id)
                ->where('sn.status_otgruzka', 0)
                ->whereRaw("(POSITION('ЗАПРЕТ' IN UPPER(sn.comments)) = 0 OR sn.comments IS NULL)")
                ->orderBy('sn.NAME', 'sn.description', 'oon.no::INT')
                ->get();

            if ($history->isEmpty()) {
                return response()->json(['error' => 'История для данного ID операции не найдена.'], 404);
            }

            $groupedData = $history->groupBy('id_tool')->map(function ($group) {
                $totalQuantity = $group->sum('quantity');
                $data = $group->map(function ($item) {
                    return [
                        'name' => $item->NAME,
                        'description' => $item->description,
                        'no_oper' => $item->no_oper,
                        'type_oper' => $item->type_oper,
                        'specs_op_id' => $item->specs_op_id,
                        'id' => $item->ID,
                        'quantity' => $item->quantity,
                        'id_user' => $item->id_user,
                        'id_tool' => $item->id_tool,
                        'date' => Carbon::parse($item->date)->format('Y-m-d'),
                        'user_fio' => $item->user_fio,
                        'name_tool' => $item->name_tool,
                        'type' => 'position',
                    ];
                });
                return array_merge($data->toArray(), [
                    [
                        'name' => $data->first()->NAME,
                        'description' => $data->first()->description,
                        'no_oper' => $data->first()->no_oper,
                        'type_oper' => $data->first()->type_oper,
                        'specs_op_id' => $data->first()->specs_op_id,
                        'id' => $data->first()->ID,
                        'quantity' => $totalQuantity,
                        'id_user' => null,
                        'id_tool' => $data->first()->id_tool,
                        'date' => '',
                        'user_fio' => '',
                        'name_tool' => $data->first()->name_tool,
                        'type' => 'sum',
                    ]
                ]);
            });

            $finalData = $groupedData->flatten(1);
            return response()->json($finalData);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при запросе истории инструмента.'], 500);
        }
    }

    public function getAllIssuedToolIdsWithNames(): \Illuminate\Http\JsonResponse
    {
        try {
            $toolIds = DB::table('tool_history_nom as thn')
                ->select('thn.id_tool', 'tn.name')
                ->leftJoin('tool_nom as tn', 'thn.id_tool', '=', 'tn.id')
                ->distinct()
                ->orderBy('tn.name')
                ->get();
            return response()->json($toolIds);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при получении идентификаторов инструмента.'], 500);
        }
    }

    public function getToolMovementById($id): \Illuminate\Http\JsonResponse
    {
        try {
            $movements = DB::table('vue_log as l')
                ->select(
                    'l.id as log_id',
                    'l.message',
                    'l.datetime_log',
                    'l.new_amount',
                    'l.old_amount',
                    'tn.name as tool_name',
                    'vu.login as user_login',
                    'tn.id as tool_nom_id',
                    'vu.id as vue_users_id'
                )
                ->leftJoin('tool_nom as tn', 'l.tool_id', '=', 'tn.id')
                ->leftJoin('vue_users as vu', 'l.user_id', '=', 'vu.id')
                ->where('l.tool_id', $id)
                ->orderBy('l.datetime_log', 'DESC')
                ->get();

            if ($movements->isEmpty()) {
                return response()->json(['error' => 'Движение для данного инструмента не найдено.'], 404);
            }

            return response()->json($movements);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при запросе движения инструмента.'], 500);
        }
    }
}
