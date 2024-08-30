<?php

namespace App\Http\Controllers\Tool\Main;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ParamController extends Controller
{

// Метод для получения параметров инструмента по ID родительской записи
    // Получение списка параметров инструмента
    public function getToolParams(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $sortBy = $request->query('sort') ?? 'param_order';
            $query = "SELECT id, label, param_order FROM dbo.tool_params ORDER BY {$sortBy} ASC";
            $result = DB::select($query);
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error fetching tool parameters:', $e);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    // Добавление нового параметра инструмента
    public function addToolParam(Request $request): \Illuminate\Http\JsonResponse
    {
        $validatedData = $request->validate([
            'label' => 'required|string',
        ]);

        try {
            $query = 'INSERT INTO dbo.tool_params (label) VALUES (?) RETURNING *';
            $result = DB::select($query, [$validatedData['label']]);

            if (count($result) > 0) {
                return response()->json($result[0], 201);
            } else {
                return response()->json(['error' => 'Parameter could not be added'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Error adding new tool parameter:', $e);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    // Перемещение параметра инструмента
    public function moveToolParam(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        $validatedData = $request->validate([
            'action' => 'required|in:moveUp,moveDown',
        ]);

        try {
            // Получение текущего порядка параметра
            $currentOrderQuery = 'SELECT param_order FROM dbo.tool_params WHERE id = ?';
            $currentOrderResult = DB::select($currentOrderQuery, [$id]);
            if (empty($currentOrderResult)) {
                return response()->json(['error' => 'Parameter not found'], 404);
            }
            $currentOrder = $currentOrderResult[0]->param_order;

            // Определение нового порядка
            $newOrderQuery = $validatedData['action'] === 'moveUp'
                ? 'SELECT id, param_order FROM dbo.tool_params WHERE param_order < ? ORDER BY param_order DESC LIMIT 1'
                : 'SELECT id, param_order FROM dbo.tool_params WHERE param_order > ? ORDER BY param_order ASC LIMIT 1';

            $newOrderResult = DB::select($newOrderQuery, [$currentOrder]);
            if (empty($newOrderResult)) {
                return response()->json(['error' => 'No adjacent parameters to swap with'], 400);
            }

            $adjacentParam = $newOrderResult[0];
            $adjacentOrderId = $adjacentParam->id;
            $adjacentOrder = $adjacentParam->param_order;

            // Обновление порядка в транзакции
            DB::beginTransaction();
            try {
                $updateCurrentQuery = 'UPDATE dbo.tool_params SET param_order = ? WHERE id = ?';
                DB::update($updateCurrentQuery, [$adjacentOrder, $id]);
                $updateAdjacentQuery = 'UPDATE dbo.tool_params SET param_order = ? WHERE id = ?';
                DB::update($updateAdjacentQuery, [$currentOrder, $adjacentOrderId]);
                DB::commit();
                return response()->json(['message' => 'Parameter order updated successfully']);
            } catch (\Exception $e) {
                DB::rollback();
                Log::error('Error moving tool parameter:', $e);
                return response()->json(['error' => 'Internal Server Error'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error moving tool parameter:', $e);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    // Получение параметров фильтрации по ID родителя
    public function getToolParamsParentId(Request $request, $id)
    {
        try {
            $query = "
                SELECT property
                FROM dbo.tool_nom
                WHERE parent_id = ?";

            $toolProperties = DB::select($query, [$id]);

            $paramsAggregation = [];
            foreach ($toolProperties as $toolProperty) {
                $property = json_decode($toolProperty->property, true);
                if (!empty($property)) {
                    foreach ($property as $key => $value) {
                        if (!isset($paramsAggregation[$key])) {
                            $paramsAggregation[$key] = ['numbers' => [], 'texts' => []];
                        }

                        if (is_numeric($value) && is_finite($value)) {
                            $paramsAggregation[$key]['numbers'][] = (float) $value;
                        } else {
                            $paramsAggregation[$key]['texts'][] = $value;
                        }
                    }
                }
            }

            $paramsList = [];
            foreach ($paramsAggregation as $key => $paramData) {
                $paramsList[] = [
                    'id' => $key,
                    'values' => array_merge(
                        array_unique(sort($paramData['numbers']) ? $paramData['numbers'] : []),
                        array_unique(sort($paramData['texts']) ? $paramData['texts'] : [])
                    ),
                ];
            }

            return response()->json($paramsList);
        } catch (\Exception $e) {
            Log::error('Ошибка при получении уникальных значений параметра:', $e);
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    // Получение списка имен инструментов по ID родителя
    public function getToolNameId(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        try {
            $query = 'SELECT id, name FROM dbo.tool_nom WHERE parent_id = ?';
            $result = DB::select($query, [$id]);
            $namesArray = array_map(function ($row) {
                return $row->name;
            }, $result);
            return response()->json($namesArray);
        } catch (\Exception $e) {
            Log::error('Ошибка при получении названий инструментов по parent_id:', $e);
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    // Удаление параметра инструмента
    public function deleteToolParam($id)
    {
        try {
            $query = 'DELETE FROM dbo.tool_params WHERE id = ?';
            $result = DB::delete($query, [$id]);

            if ($result === 0) {
                return response()->json(['error' => 'Parameter not found'], 404);
            } else {
                return response()->json(['message' => 'Parameter deleted successfully']);
            }
        } catch (\Exception $e) {
            Log::error('Error deleting tool parameter:', $e);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    // Обновление параметра инструмента
    public function updateToolParam(Request $request, $id)
    {
        $validatedData = $request->validate([
            'label' => 'required|string',
        ]);

        try {
            $query = 'UPDATE dbo.tool_params SET label = ? WHERE id = ?';
            $result = DB::update($query, [$validatedData['label'], $id]);

            if ($result === 0) {
                return response()->json(['error' => 'Parameter not found'], 404);
            } else {
                return response()->json(['message' => 'Parameter updated successfully']);
            }
        } catch (\Exception $e) {
            Log::error('Error updating tool parameter:', $e);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }


}
