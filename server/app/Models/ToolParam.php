<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolParam extends Model
{
    use HasFactory;

    protected $table = 'dbo.tool_params'; // Укажите имя вашей таблицы, если оно не соответствует Laravel naming convention

    protected $fillable = ['info'];
    // Пример поля, которое вы хотите сделать массово назначаемым
    // Добавьте другие поля сюда, как необходимо

    // Если в вашей таблице есть поля created_at и updated_at, Laravel автоматически их обработает.
    // Если таких полей нет, добавьте следующую строку:
    public $timestamps = false;
}
