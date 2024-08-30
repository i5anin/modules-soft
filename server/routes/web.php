<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});

Route::get('/', function () {
    return redirect('/api/documentation');
});

//Route::get('/my_page', [GetToolsController::class, 'index']);
//Route::get('/posts', [GetToolsController::class, 'index']);
//Route::get('/tools', [GetToolsController::class, 'getTools']);
//
//
//Route::get('/posts/create', [GetToolsController::class, 'create']);
//
//
////Route::get('/tool/create', [PostController::class, 'create']);
////Route::get('/tool/update/{id}', [PostController::class, 'update']);
////Route::get('/tool/delete/{id}', [PostController::class, 'delete']);
//
//
//Route::get('/tool/{id}', [GetToolsController::class, 'show']);
//Route::get('/find/{search}', [GetToolsController::class, 'search']);


