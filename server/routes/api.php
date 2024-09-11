<?php


use App\Http\Controllers\OrderMetrologistCalc\OrderMetrologistCalcController;
use App\Http\Controllers\OrderMetrologistCalc\OrdersNomController;


// Add the /OrderMetrologistCalc group
Route::group(['prefix' => 'order_metrologist_calc'], function () {
    Route::get('/table', [OrderMetrologistCalcController::class, 'getOrdersData']);
    Route::get('/order', [OrdersNomController::class, 'getOrderNomList']);
});

// Ресурсный маршрут
Route::resource('posts', \App\Http\Controllers\ToolsNom\GetToolsController::class);
