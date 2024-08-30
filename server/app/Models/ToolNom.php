<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolNom extends Model
{
    use HasFactory;

    // Указываем имя таблицы в базе данных, с которой работает модель
    protected $table = 'tool_nom';

    // Определяем поля, которые разрешено изменять при создании или обновлении записей
    protected $fillable = [
        'name',
        'sklad',
        'norma',
        'property',
        'parent_id',
        'group_id',
        'group_standard'
    ];

    // Отключаем автоматическое отслеживание временных меток (created_at, updated_at)
    public $timestamps = false;

    // Определяем отношение belongsTo "один ко многим" с моделью ToolGroup
    // Каждый инструмент принадлежит одной группе
    public function group(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ToolGroup::class, 'group_id');
    }

    // Определяем отношение belongsTo "один ко многим" с моделью ToolTree
    // Каждый инструмент может иметь родительский инструмент
    public function parent(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ToolTree::class, 'parent_id');
    }

}
