<?php


use App\Http\Controllers\OrderMetrologistCalc\OrderMetrologistCalcController;


// Add the /OrderMetrologistCalc group
Route::group(['prefix' => 'order_metrologist_calc'], function () {
    Route::get('/table', [OrderMetrologistCalcController::class, 'getOrdersData']);
});

// Ресурсный маршрут
Route::resource('posts', \App\Http\Controllers\ToolsNom\GetToolsController::class);
