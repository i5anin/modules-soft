<?php

namespace App\Http\Controllers\Tool\Main;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TreeController extends Controller
{
    /**
     * Получение дерева инструментов.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getToolsTree(Request $request): \Illuminate\Http\JsonResponse
    {
        $parentId = $request->query('parent_id', 0); // Получаем parent_id из запроса или используем 0 по умолчанию
        $tree = $this->buildTreeData($parentId);

        return response()->json($tree);
    }

    /**
     * Рекурсивная функция для построения дерева данных.
     *
     * @param  int  $parentId
     * @return \Illuminate\Support\Collection
     */
    protected function buildTreeData($parentId = 0): \Illuminate\Support\Collection
    {
        $nodes = DB::table('dbo.tool_tree as t')
            ->select('t.id', 't.parent_id', 't.name',
                DB::raw('(SELECT COUNT(*) FROM dbo.tool_nom n WHERE n.parent_id = t.id) as element_count'),
                DB::raw('(SELECT COUNT(*) FROM dbo.tool_nom n WHERE n.parent_id = t.id AND n.sklad > 0) as available_count')
            )
            ->where('t.parent_id', $parentId)
            ->orderBy('t.name')
            ->get();

        $treeData = $nodes->map(function ($node) {
            $children = $this->buildTreeData($node->id);
            $totalElements = $children->sum('totalElements') + $node->element_count;
            $totalAvailable = $children->sum('totalAvailable') + $node->available_count;

            return [
                'id' => $node->id,
                'label' => $node->name,
                'elements' => $node->element_count,
                'available' => $node->available_count,
                'totalElements' => $totalElements,
                'totalAvailable' => $totalAvailable,
                'nodes' => $children,
            ];
        });

        return $treeData;
    }

    /**
     * Удаление папки из дерева инструментов.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteFolderTree($id): \Illuminate\Http\JsonResponse
    {
        // Запрет на удаление корневой папки и папки с ID 0
        if ($id == 0) {
            return response()->json(['message' => 'Нельзя удалить папку с ID 0'], 400);
        }

        // Проверки наличия дочерних элементов и номенклатуры
        $childCount = DB::table('dbo.tool_tree')->where('parent_id', $id)->count();
        $nomenclatureCount = DB::table('dbo.tool_nom')->where('parent_id', $id)->count();

        if ($childCount > 0 || $nomenclatureCount > 0) {
            return response()->json(['message' => 'Нельзя удалить папку с дочерними элементами или привязанными номенклатурами'], 400);
        }

        DB::table('dbo.tool_tree')->where('id', $id)->delete();

        return response()->json(['message' => 'Папка успешно удалена']);
    }

    /**
     * Обновление названия папки в дереве инструментов.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateFolderTree(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'newName' => 'required|string|max:255',
        ]);

        $folder = DB::table('dbo.tool_tree')->where('id', $id)->first();

        if (!$folder || $folder->parent_id == 0) {
            return response()->json(['message' => 'Недопустимая операция для корневой папки или папка не найдена'], 400);
        }

        DB::table('dbo.tool_tree')->where('id', $id)->update(['name' => $validated['newName']]);

        return response()->json(['message' => 'Название папки успешно обновлено']);
    }

    /**
     * Добавление новой ветви в дерево инструментов.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addBranch(Request $request): \Illuminate\Http\JsonResponse
    {
        Log::info('Starting addBranch method', ['request' => $request->all()]);

        try {
            // Валидация входных данных.
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'parent_id' => 'required|integer|exists:tool_tree,id',
            ]);

            // Вставка новой записи в таблицу `tool_tree` через подключение 'dbo'.
            // Примечание: Замените 'dbo' на имя вашего подключения к PostgreSQL.
            $toolTreeId = DB::connection('dbo')->table('tool_tree')->insertGetId([
                'name' => $validatedData['name'],
                'parent_id' => $validatedData['parent_id'],
            ]);

            Log::info('New branch added successfully', ['newBranchId' => $toolTreeId]);

            // Возврат успешного ответа с ID новой ветви.
            return response()->json([
                'message' => 'New branch added successfully.',
                'newBranchId' => $toolTreeId,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Обработка ошибок валидации.
            Log::error('Validation error in addBranch method', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Validation error', 'messages' => $e->errors()], 422);

        } catch (\Exception $e) {
            // Обработка других исключений.
            Log::error('Error in addBranch method', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }
}
