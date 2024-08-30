<?php

namespace App\Http\Controllers\Tool;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HistoryDamagedController extends Controller
{
    public function getDamaged(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $page = $request->query('page', 1);
            $limit = $request->query('limit', 15);
            $offset = ($page - 1) * $limit;

            $totalCount = DB::table('tool_history_damaged')
                ->select(DB::raw('COUNT(DISTINCT id)'))
                ->pluck('COUNT(DISTINCT id)')
                ->first();

            $toolsHistory = DB::table('tool_history_damaged')
                ->select(
                    'tool_history_damaged.id',
                    'tool_history_damaged.id_tool',
                    'tool_nom.name AS tool_name',
                    'tool_history_damaged.id_user',
                    DB::raw(
                        "CASE
                            WHEN tool_history_damaged.id_user < 0 THEN
                                (SELECT name FROM dbo.tool_user_custom_list WHERE id = -tool_history_damaged.id_user)
                            ELSE
                                operators.fio
                            END AS user_name"
                    ),
                    'tool_history_damaged.cnc_code',
                    'cnc.cnc_name',
                    'tool_history_damaged.comment',
                    'tool_history_damaged.quantity',
                    'tool_history_damaged.timestamp'
                )
                ->leftJoin('tool_nom', 'tool_history_damaged.id_tool', '=', 'tool_nom.id')
                ->leftJoin('operators', function ($join) {
                    $join->on('tool_history_damaged.id_user', '=', 'operators.id')
                        ->where('tool_history_damaged.id_user', '>', 0);
                })
                ->leftJoin('cnc', 'tool_history_damaged.cnc_code', '=', 'cnc.cnc_code')
                ->orderBy('tool_history_damaged.timestamp', 'DESC')
                ->limit($limit)
                ->offset($offset)
                ->get();

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

    public function addToolHistoryDamaged(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'id_tool' => 'required|integer',
                'id_user' => 'required|integer',
                'comment' => 'required|string',
                'quantity' => 'required|integer',
                'cnc_code' => 'nullable|string', // cnc_code становится необязательным
            ]);

            // Проверяем существование пользователя
            // В вашем случае, похоже, вы хотите использовать как обычных пользователей, так и "пользователей-инструментов"
            // Если id_user > 0, то это обычный пользователь, если < 0, то пользователь-инструмент
            $userExists = DB::table('operators')->where('id', $validatedData['id_user'])->exists();
            if ($validatedData['id_user'] > 0 && !$userExists) {
                return response()->json(['error' => 'Пользователь не найден'], 400);
            }

            // Проверяем существование станка, если он был передан
            if ($validatedData['cnc_code']) {
                $cncExists = DB::table('cnc')
                    ->where('cnc_code', $validatedData['cnc_code'])
                    ->where('active', true)
                    ->exists();
                if (!$cncExists) {
                    return response()->json(['error' => 'Станок с указанным кодом не найден или не активен'], 404);
                }
            }

            // Проверяем существование инструмента и достаточное количество на складе
            $tool = DB::table('tool_nom')->where('id', $validatedData['id_tool'])->first();
            if (!$tool) {
                return response()->json(['error' => 'Инструмент не найден'], 400);
            }
            if ($tool->sklad < $validatedData['quantity']) {
                return response()->json(['error' => 'Недостаточно инструмента на складе'], 400);
            }

            // Вставка данных в таблицу tool_history_damaged
            $newId = DB::table('tool_history_damaged')->insertGetId([
                'id_tool' => $validatedData['id_tool'],
                'id_user' => $validatedData['id_user'],
                'cnc_code' => $validatedData['cnc_code'],
                'comment' => $validatedData['comment'],
                'quantity' => $validatedData['quantity'],
                'timestamp' => Carbon::now(),
            ]);

            // Обновление количества инструмента на складе
            DB::table('tool_nom')
                ->where('id', $validatedData['id_tool'])
                ->update(['sklad' => DB::raw('sklad - ' . $validatedData['quantity'])]);

            $updatedQuantity = DB::table('tool_nom')->where('id', $validatedData['id_tool'])->value('sklad');

            return response()->json([
                'success' => true,
                'message' => 'Запись успешно добавлена и количество на складе обновлено',
                'updatedQuantity' => $updatedQuantity,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ошибка при добавлении записи о поврежденном инструменте'], 500);
        }
    }
}
