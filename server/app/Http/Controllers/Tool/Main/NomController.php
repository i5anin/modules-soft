<?php

namespace App\Http\Controllers\Tool\Main;

use App\Http\Controllers\Controller;
use App\Models\ToolNom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NomController extends Controller
{

    // Метод для получения инструмента по ID вместе с именем папки
    public function getToolById(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        try {
            // Объединяем таблицы tool_nom и tool_tree для получения нужной информации
            $tool = DB::table('dbo.tool_nom')
                ->leftJoin('dbo.tool_tree', 'dbo.tool_nom.parent_id', '=', 'dbo.tool_tree.id')
                ->select('dbo.tool_nom.*', 'dbo.tool_tree.name as folder_name')
                ->where('dbo.tool_nom.id', '=', $id)
                ->first();

            if ($tool) {
                // Формирование ответа
                $response = [
                    'id' => $tool->id,
                    'parent_id' => $tool->parent_id,
                    'name' => $tool->name,
                    'folder_name' => $tool->folder_name,
                    'property' => json_decode($tool->property, true), // предполагаем, что property - это JSON строка
                    'sklad' => $tool->sklad,
                    'group_id' => $tool->group_id,
                    'group_standard' => $tool->group_standard,
                    'norma' => $tool->norma,
                ];

                return response()->json($response);
            } else {
                return response()->json(['message' => 'Инструмент не найден'], 404);
            }
        } catch (\Exception $e) {
            \Log::error('Ошибка при получении инструмента: ' . $e->getMessage());
            return response()->json(['message' => 'Внутренняя ошибка сервера'], 500);
        }
    }

    // Метод для получения списка инструментов
    public function getTools(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            // Объединяем параметры из запроса
            $params = array_merge($request->query(), $request->input());

            $search = $params['search'] ?? null;
            $parentId = $params['parent_id'] ?? null;
            $onlyInStock = $params['onlyInStock'] ?? null;
            $page = $params['page'] ?? 1;
            $limit = $params['limit'] ?? 50;
            $offset = ($page - 1) * $limit;

            $query = ToolNom::query();

            // Добавление условий поиска Используйте where для поиска по имени
            if ($search) {
                $query->where('name', 'LIKE', "%{$search}%");
            }
            if ($parentId) {
                $query->where('parent_id', $parentId);
            }
            if ($onlyInStock === 'true') {
                $query->where('sklad', '>', 0);
            }

            // Добавление динамических параметров
            $dynamicParams = collect($params)->filter(function ($value, $key) {
                return str_starts_with($key, 'param_') && $value;
            })->map(function ($value, $key) {
                $paramId = explode('_', $key)[1];
                return "CAST(property->>'{$paramId}' AS TEXT) = '{$value}'";
            })->toArray();

            if (!empty($dynamicParams)) {
                $query->whereRaw(implode(' AND ', $dynamicParams));
            }

            // Получить общее количество элементов без ограничения
            $totalCount = $query->count();

            // Получить элементы с учетом пагинации и сортировки
            $tools = $query
                ->orderByRaw('sklad > 0 DESC, name')
                ->offset($offset)
                ->limit($limit)
                ->get(['id', 'name', 'property', 'sklad', 'norma', 'group_id', 'group_standard']);

            // Создать параметры property для ответа
            $formattedTools = $tools->map(function ($tool) {
                $formattedProperty = [];

                // Проверяем, является ли property строкой
                if (is_string($tool->property)) {
                    $properties = json_decode($tool->property, true);
                    if (is_array($properties)) {
                        $formattedProperty = collect($properties)->mapWithKeys(function ($value, $key) {
                            return [$key => ['label' => $this->paramInfo($key), 'value' => $value]];
                        })->all();
                    }
                } else {
                    // Если свойство не строка, оставляем его без изменений (например, если оно уже является массивом)
                    $formattedProperty = $tool->property;
                }

                return [
                    'id' => $tool->id,
                    'name' => $tool->name,
                    'property' => $formattedProperty,
                    'sklad' => $tool->sklad,
                    'norma' => $tool->norma,
                    'group_id' => $tool->group_id,
                    'group_standard' => $tool->group_standard,
                ];
            })->toArray();

            // Получение списка параметров (paramsList)
            $uniqueParams = collect($tools)->pluck('property')->flatten()->unique()->toArray();
            $propertyValues = [];

            foreach ($tools as $tool) {
                if ($tool->property) {
                    $propertyObj = json_decode($tool->property, true);
                    if (is_array($propertyObj)) {
                        foreach ($propertyObj as $key => $value) {
                            if (!empty($value) && in_array($key, $uniqueParams)) {
                                if (!isset($propertyValues[$key])) {
                                    $propertyValues[$key] = [];
                                }
                                $propertyValues[$key][] = $value;
                            }
                        }
                    }
                }
            }

            $paramsList = array_map(function ($key) use ($propertyValues) {
                if (count($propertyValues[$key]) > 1) {
                    return [
                        'key' => $key,
                        'label' => $this->paramInfo($key) ?? $key,
                        'values' => $propertyValues[$key],
                    ];
                }
                return null;
            }, array_keys($propertyValues));
            $paramsList = array_filter($paramsList);

            return response()->json([
                'currentPage' => $page,
                'itemsPerPage' => $limit,
                'totalCount' => $totalCount,
                'tools' => $formattedTools,
                'paramsList' => $paramsList,
            ]);
        } catch (\Exception $e) {
            Log::error($e);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }


    // Метод для добавления нового инструмента
    public function addTool(Request $request): \Illuminate\Http\JsonResponse
    {
        // Валидируем входящие данные из запроса
        $validatedData = $request->validate([
            'name' => 'required|string', // имя инструмента обязательно и должно быть строкой
            'parent_id' => 'required|integer|gt:1', // id родительского элемента обязателен, должен быть числом и больше 1
            'property' => 'nullable|json', // свойство может быть null или строкой в формате JSON
            'sklad' => 'nullable', // склад может быть null (тип не указан)
            'norma' => 'nullable', // норма может быть null (тип не указан)
            'group_id' => 'nullable|integer', // id группы может быть null или числом
            'group_standard' => 'nullable|boolean', // эталонность группы может быть null или булевым значением
        ]);

        // Декодируем JSON-строку свойства в массив
        $property = json_decode($validatedData['property'], true);

        try {
            // Проверяем, существует ли свойство с указанным id в таблице tool_params
            if (!empty($property) && !empty($property['id'])) {
                $propertyIdCheckResult = DB::table('dbo.tool_params')
                    ->where('id', $property['id'])
                    ->exists();

                if (!$propertyIdCheckResult) {
                    return response()->json(['error' => 'Specified property.id does not exist in tool_params.'], 400);
                }
            }

            // Проверяем, существует ли родительский элемент с указанным id в таблице tool_tree
            $parentCheckResult = DB::table('dbo.tool_tree')
                ->where('id', $validatedData['parent_id'])
                ->exists();

            if (!$parentCheckResult) {
                return response()->json(['error' => 'Specified parent_id does not exist.'], 400);
            }

            // Удаляем все null-значения из массива свойств
            $propertyWithoutNull = array_filter($property, function($value) {
                return !is_null($value);
            });

            // Если инструмент является эталонным для группы,
            // сбрасываем флаг эталонности для предыдущего эталонного инструмента в этой группе
            if ($validatedData['group_standard'] && $validatedData['group_id']) {
                DB::table('dbo.tool_nom')
                    ->where('group_id', $validatedData['group_id'])
                    ->update(['group_standard' => false]);
            }

            // Вставляем новый инструмент в таблицу tool_nom и получаем его id
            $toolInsertResult = DB::table('dbo.tool_nom')->insertGetId([
                'name' => $validatedData['name'],
                'parent_id' => $validatedData['parent_id'],
                'property' => json_encode($propertyWithoutNull), // кодируем массив свойств обратно в JSON
                'sklad' => $validatedData['sklad'],
                'norma' => $validatedData['norma'],
                'group_id' => $validatedData['group_id'],
                'group_standard' => $validatedData['group_standard'],
            ]);

            // Логируем добавление инструмента в таблицу vue_log
            DB::table('dbo.vue_log')->insert([
                'message' => 'Инструмент успешно добавлен ID ' . $toolInsertResult . ', группа ' . $validatedData['group_id'],
                'tool_id' => $toolInsertResult,
                'datetime_log' => now(),
                'new_amount' => $validatedData['sklad'],
            ]);

            // Получаем информацию о добавленном инструменте из таблицы tool_nom
            $newToolResult = DB::table('dbo.tool_nom')
                ->where('id', $toolInsertResult)
                ->first();

            // Если инструмент найден, возвращаем успешный ответ с данными инструмента
            if ($newToolResult) {
                return response()->json(['success' => 'OK', 'data' => $newToolResult], 200);
                // Иначе возвращаем ошибку, что инструмент не найден
            } else {
                return response()->json(['error' => 'Tool added, but not found.'], 404);
            }
        } catch (\Exception $e) {
            // Логируем ошибку при добавлении инструмента
            \Log::error('Error adding tool: ' . $e->getMessage());
            return response()->json(['error' => 'Error adding tool: ' . $e->getMessage()], 500);
        }
    }


    // Метод для изменения данных инструмента
    public function editTool(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'parent_id' => 'required|integer|gt:1',
            'property' => 'nullable|json',
            'sklad' => 'nullable',
            'norma' => 'nullable',
            'group_id' => 'nullable|integer',
            'group_standard' => 'nullable|boolean',
        ]);

        $property = json_decode($validatedData['property'], true);

        try {
            // Проверка наличия property.id в таблице tool_params
            if (!empty($property) && !empty($property['id'])) {
                $propertyIdCheckResult = DB::table('dbo.tool_params')
                    ->where('id', $property['id'])
                    ->exists();

                if (!$propertyIdCheckResult) {
                    return response()->json(['error' => 'Specified property.id does not exist in tool_params.'], 400);
                }
            }

            // Проверка наличия parent_id в таблице tool_tree
            $parentCheckResult = DB::table('dbo.tool_tree')
                ->where('id', $validatedData['parent_id'])
                ->exists();

            if (!$parentCheckResult) {
                return response()->json(['error' => 'Specified parent_id does not exist.'], 400);
            }

            // Проверка существования инструмента
            $currentSkladResult = DB::table('dbo.tool_nom')
                ->where('id', $id)
                ->select('sklad')
                ->first();

            if (!$currentSkladResult) {
                return response()->json(['error' => 'Tool with the specified ID not found.'], 404);
            }

            // Удаление null-значений из property
            $propertyWithoutNull = array_filter($property, function($value) {
                return !is_null($value);
            });

            // Обновление group_standard (сброс флага для других инструментов в группе)
            if ($validatedData['group_standard']) {
                DB::table('dbo.tool_nom')
                    ->where('group_id', $validatedData['group_id'])
                    ->where('id', '!=', $id)
                    ->update(['group_standard' => false]);
            }

            // Обновление инструмента
            $result = DB::table('dbo.tool_nom')
                ->where('id', $id)
                ->update([
                    'name' => $validatedData['name'],
                    'parent_id' => $validatedData['parent_id'],
                    'property' => json_encode($propertyWithoutNull),
                    'sklad' => $validatedData['sklad'],
                    'norma' => $validatedData['norma'],
                    'group_id' => $validatedData['group_id'],
                    'group_standard' => $validatedData['group_standard'],
                ]);

            if ($result) {
                // Логирование обновления
                DB::table('dbo.vue_log')->insert([
                    'message' => 'Обновлен ID инструмента ' . $id,
                    'tool_id' => $id,
                    'datetime_log' => now(),
                    'old_amount' => $currentSkladResult->sklad,
                    'new_amount' => $validatedData['sklad'],
                ]);

                // Получение обновленной информации об инструменте
                $updatedTool = DB::table('dbo.tool_nom')
                    ->where('id', $id)
                    ->first();

                return response()->json(['success' => 'OK', 'data' => $updatedTool], 200);
            } else {
                return response()->json(['error' => 'Tool with the specified ID not found.'], 404);
            }
        } catch (\Exception $e) {
            \Log::error('Error updating tool: ' . $e->getMessage());
            return response()->json(['error' => 'Error updating tool: ' . $e->getMessage()], 500);
        }
    }

    // Метод для удаления инструмента
    public function deleteTool($id): \Illuminate\Http\JsonResponse
    {
        try {
            // Проверка существования инструмента
            $exists = DB::table('dbo.tool_nom')->where('id', $id)->exists();

            if (!$exists) {
                return response()->json(['error' => 'Запись не найдена.'], 404);
            }

            // Проверка наличия параметров, связанных с инструментом
            $hasParams = DB::table('dbo.tool_params')->where('parent_id', $id)->exists();

            if ($hasParams) {
                // Удаление параметров, связанных с инструментом
                DB::table('dbo.tool_params')->where('parent_id', $id)->delete();
            }

            // Удаление инструмента
            $result = DB::table('dbo.tool_nom')->where('id', $id)->delete();

            // Проверяем, была ли удалена хотя бы одна запись
            if ($result > 0) {
                return response()->json(['success' => 'OK']);
            } else {
                return response()->json(['error' => 'Ошибка при удалении записи.'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getFilterParamsByParentId($parent_id): \Illuminate\Http\JsonResponse
    {
        $parent_id = (int) $parent_id;

        // Валидация parent_id
        if (!is_numeric($parent_id) || !is_int($parent_id)) {
            Log::error('Неверный формат parent_id: ' . $parent_id);
            return response()->json(['error' => 'Parent ID must be an integer'], 400);
        }

        try {
            // Получение маппинга параметров
            $paramsMapping = DB::table('dbo.tool_params')
                ->select('id', 'label', 'param_order')
                ->get()
                ->reduce(function ($acc, $param) {
                    $acc[$param->id] = ['label' => $param->label, 'param_order' => $param->param_order];
                    return $acc;
                }, []);

            // Получение свойств инструментов
            $toolProperties = DB::table('dbo.tool_nom')
                ->where('parent_id', $parent_id)
                ->select('property')
                ->get();

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

            // Формирование результата
            $paramsList = collect($paramsAggregation)->map(function ($paramData, $key) use ($paramsMapping) {
                return [
                    'param_order' => $paramsMapping[$key]['param_order'] ?? null,
                    'key' => (string) $key, //todo: должно быть числом
                    'label' => $paramsMapping[$key]['label'] ?? $key,
                    'values' => array_merge(
                        array_unique(sort($paramData['numbers']) ? $paramData['numbers'] : []),
                        array_unique(sort($paramData['texts']) ? $paramData['texts'] : [])
                    ),
                ];
            })->filter(function ($param) {
                return count($param['values']) > 0;
            })->sortBy('param_order')->values()->toArray();

            return response()->json($paramsList);
        } catch (\Exception $e) {
            Log::error('Ошибка при получении параметров фильтрации: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    // Вспомогательный метод для получения информации о параметре
    protected function paramInfo($id)
    {
        static $params = null;

        if ($params === null) {
            $params = DB::table('tool_params')->pluck('label', 'id');
        }

        return $params[$id] ?? null;
    }

}
