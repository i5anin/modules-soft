<?php

namespace App\Http\Controllers\Tool\Main;

use App\Http\Controllers\Controller;
use App\Models\ToolNom; // Импорт модели ToolNom
use Illuminate\Http\Request; // Импорт класса Request

class GroupController extends Controller
{
    public function getGroupedTools(): \Illuminate\Http\JsonResponse
    {
        // Получение всех инструментов, принадлежащих группам
        $tools = ToolNom::with(['group', 'parent']) // Загрузка данных о группах и родителях инструментов
        ->where('group_id', '<>', 0) // Фильтрация инструментов, принадлежащих группам (group_id != 0)
        ->orderBy('group_id', 'asc') // Сортировка инструментов по возрастанию group_id
        ->get(); // Получение коллекции инструментов

        // Группировка инструментов по group_id
        $groupedTools = $tools->groupBy('group_id') // Группировка инструментов по group_id
        ->map(function ($groupTools) { // Итерация по каждой группе инструментов
            // Сортировка стандартных инструментов по возрастанию
            $groupStandards = $groupTools->where('group_standard', true)->sortBy('name'); // Выбор стандартных инструментов (group_standard = true) и сортировка по имени
            // Сортировка остальных инструментов по возрастанию
            $groupOthers = $groupTools->where('group_standard', false)->sortBy('name'); // Выбор остальных инструментов (group_standard = false) и сортировка по имени
            // Объединение стандартных и остальных инструментов в одну коллекцию
            return $groupStandards->merge($groupOthers)
                ->map(function ($tool) { // Итерация по каждому инструменту в группе
                    // Формирование данных для ответа API
                    return [
                        'id' => $tool->id, // ID инструмента
                        'name' => $tool->name, // Имя инструмента
                        'sklad' => $tool->sklad, // Склад инструмента
                        'norma' => $tool->norma, // Норма инструмента
                        'property' => json_decode($tool->property, true), // Свойства инструмента (декодирование JSON)
                        'parent_id' => $tool->parent_id, // ID родителя инструмента
                        'group_id' => $tool->group_id, // ID группы инструмента
                        'group_standard' => $tool->group_standard, // Флаг, является ли инструмент стандартным
                        'path' => $tool->parent->path(), // Получение пути к родителю инструмента (с помощью метода path() в модели ToolTree)
                    ];
                });
        });

        // Возвращение ответа API в формате JSON
        return response()->json($groupedTools);
    }
}
