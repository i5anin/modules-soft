<?php


use App\Http\Controllers\OrderMetrologistCalc\OrdersMetrologController;
use App\Http\Controllers\OrderNomInfoController;
use Illuminate\Support\Facades\Route;


// Add the /OrderMetrologistCalc group
Route::group(['prefix' => 'order_metrologist'], function () {
    Route::get('/orders', [OrdersMetrologController::class, 'getOrdersData']);
    Route::get('/order', [OrdersMetrologController::class, 'getOrderData']);
    Route::get('/order_nom_info', [OrderNomInfoController::class, 'view']);
});

// Ресурсный маршрут
Route::resource('posts', \App\Http\Controllers\ToolsNom\GetToolsController::class);
