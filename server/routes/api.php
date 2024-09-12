<?php


use App\Http\Controllers\OrderMetrologistCalc\OrdersMetrologController;
use App\Http\Controllers\OrderMetrologistCalc\OrdersNomController;


// Add the /OrderMetrologistCalc group
Route::group(['prefix' => 'order_metrologist'], function () {
    Route::get('/orders', [OrdersMetrologController::class, 'getOrdersData']);
    Route::get('/order', [OrdersMetrologController::class, 'getOrderData']);
});

// Ресурсный маршрут
Route::resource('posts', \App\Http\Controllers\ToolsNom\GetToolsController::class);
