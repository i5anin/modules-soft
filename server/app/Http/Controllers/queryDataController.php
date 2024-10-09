<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class queryDataController extends Controller
{
    public function execute(Request $request, $parameters)
    {
        $sql = $request->input('text');

        // Определяем используемые таблицы в запросе
        $tables = $this->extractTablesFromSQL($sql);

        // Извлекаем алиасы и исходные имена полей
        $aliases = $this->extractAliases($sql);

        // Получаем комментарии к полям из этих таблиц
        $fieldComments = $this->getFieldComments($tables);

        // Выполняем запрос
        $results = DB::select($sql, $parameters);

        // Форматируем заголовки (title) и данные (data)
        $formattedTitles = [];
        $formattedData = [];

        if (count($results) > 0) {
            // Пример обработки первой строки для формирования блока title
            foreach ($results[0] as $field => $value) {
                if ($field === 'total_count') {
                    continue;
                }
                $originalField = $aliases[$field] ?? $field;
                $table = $this->determineTable($originalField, $tables);

                $pureField = str_contains($originalField, '.') ? explode('.', $originalField)[1] : $originalField;

                // Получаем комментарий и ширину
                $fieldComment = $fieldComments[$table][$pureField]['comment'] ?? $field;
                $width = $fieldComments[$table][$pureField]['width'] ?? null;

                // Формируем блок title с добавлением ширины
                $formattedTitles[] = [
                    'name' => $field,
                    'title' => $fieldComment,
                    'width' => $width, // Добавляем ширину
                    'permissions' => [] // Здесь можно добавить список прав доступа
                ];
            }


            // Формируем блок data для каждой строки результата
            foreach ($results as $row) {
                $formattedRow = [];

                foreach ($row as $field => $value) {
                    $formattedRow[$field] = $value;
                }
                $formattedData[] = $formattedRow;
            }
        }
        $results = [
            'fields' => $formattedTitles,
            'data' => $formattedData
        ];

        if (count($results) > 0) {
            // Извлекаем значение `total_count` из первого элемента
            $info = [
                'total_count' => $results['data'][0]['total_count'] ?? null,
            ];

            // Создаем массив для таблицы номенклатур, исключая `total_count` из каждой записи.
            $kp_table = array_map(function ($row) {
                return array_filter($row, function ($key) {
                    return $key !== 'total_count';
                }, ARRAY_FILTER_USE_KEY);
            }, $results);

            // Возвращаем ответ в формате JSON
            $response = ([
                'header' => $info,  // Помещаем 'total_count' в header
                'table' => $kp_table
            ]);
            foreach ($response['table']['data'] as &$record) {
                unset($record['total_count']);
            }
            return response()->json($response);
        }
        return response()->json();
    }

    // Метод для извлечения алиасов полей из SQL-запроса
    private function extractAliases($sql)
    {
        $aliases = [];

        // Регулярное выражение для поиска алиасов в формате "field AS alias" или "table.field AS alias"
        preg_match_all('/(\w+(?:\.\w+)?)\s+AS\s+(\w+)/i', $sql, $matches);

        if (!empty($matches[1]) && !empty($matches[2])) {
            foreach ($matches[1] as $index => $originalField) {
                // Проверяем, если поле содержит точку (например, "clients.name")
                if (str_contains($originalField, '.')) {
                    // Извлекаем имя таблицы и имя поля
                    list($table, $field) = explode('.', $originalField);
                    // Сохраняем алиас, указывая на полное имя поля
                    $aliases[$matches[2][$index]] = "$table.$field";
                } else {
                    // Если алиас не связан с таблицей, просто сохраняем его
                    $aliases[$matches[2][$index]] = $originalField;
                }
            }
        }

        return $aliases;
    }


    // Метод для получения комментариев полей
    private function getFieldComments($tables)
    {
        $comments = [];

        foreach ($tables as $table) {
            $tableComments = DB::select("
                SELECT
                    a.attname AS field_name,
                    pgd.description AS field_comment
                FROM
                    pg_catalog.pg_class c
                JOIN
                    pg_catalog.pg_namespace n ON c.relnamespace = n.oid
                JOIN
                    pg_catalog.pg_attribute a ON a.attrelid = c.oid
                LEFT JOIN
                    pg_catalog.pg_description pgd ON pgd.objoid = a.attrelid AND pgd.objsubid = a.attnum
                WHERE
                    c.relname = ?
                    AND a.attnum > 0
                ORDER BY
                    a.attnum
            ", [$table]);

            foreach ($tableComments as $comment) {
                $fieldComment = $comment->field_comment;
                $width = null;

                // Если комментарий содержит |||, разделяем его на текст комментария и ширину.
                if (str_contains($fieldComment, '|||')) {
                    list($fieldComment, $width) = explode('|||', $fieldComment, 2);
                }

                $comments[$table][$comment->field_name] = [
                    'comment' => trim($fieldComment),
                    'width' => trim($width) // Сохраняем ширину, если она указана
                ];
            }
        }

        return $comments;
    }

    // Извлечение таблиц из SQL-запроса, фильтруем только таблицы с префиксом dbo.
    private function extractTablesFromSQL($sql)
    {
        $tables = [];

        // Регулярное выражение для поиска имен таблиц после ключевых слов JOIN или FROM.
        preg_match_all('/(?:from|join)\s+([\w.]+)/i', $sql, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $match) {
                $tableParts = explode('.', $match);
                $schema = count($tableParts) > 1 ? $tableParts[0] : '';
                $tableName = end($tableParts);

                // Проверяем, что схема — dbo
                if ($schema === 'dbo') {
                    $tables[] = $tableName;
                }
            }
        }

        return array_unique($tables);
    }

    // Определение таблицы по полю (с учетом того, что может быть "table.field")
    private function determineTable($field, $tables)
    {
        if (str_contains($field, '.')) {
            [$table] = explode('.', $field);
            if (in_array($table, $tables)) {
                return $table;
            }
        }

        foreach ($tables as $table) {
            if (array_key_exists($field, $this->getFieldComments([$table])[$table])) {
                return $table;
            }
        }

        return $tables[0] ?? 'unknown';
    }
}
