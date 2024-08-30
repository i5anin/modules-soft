<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolTree extends Model
{
    use HasFactory;

    protected $table = 'tool_tree';
    protected $fillable = ['name', 'parent_id'];
    public $timestamps = false;

    // Метод для рекурсивного построения пути
    public function path(): string
    {
        $parts = [];
        $current = $this;

        while ($current->parent) { // Проходим только по родительским узлам
            $parts[] = $current->name;
            $current = $current->parent;
        }

        // Собираем путь в обратном порядке, исключая корень
        return implode(' / ', array_reverse($parts));
    }

    // Отношение parent
    public function parent()
    {
        return $this->belongsTo(ToolTree::class, 'parent_id');
    }

    // Отношение к инструментам (ToolNom)
    public function tools()
    {
        return $this->hasMany(ToolNom::class, 'parent_id', 'id');
    }
}
