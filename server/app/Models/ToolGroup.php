<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolGroup  extends Model
{
    use HasFactory;

    protected $table = 'dbo.tool_nom'; // Измените на ваше имя таблицы
    protected $fillable = ['name', 'sklad', 'norma', 'property', 'parent_id', 'group_id', 'group_standard'];

    public function parent()
    {
        return $this->belongsTo(ToolTree::class, 'parent_id');
    }
}
