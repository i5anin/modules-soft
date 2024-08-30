<?php

use App\Http\Controllers\Login\LoginController;
use App\Http\Controllers\QRcode\QrCodeController;
use App\Http\Controllers\Tool\BuchWeekController;
use App\Http\Controllers\Tool\HistoryDamagedController;
use App\Http\Controllers\Tool\HistoryIssueController;
use App\Http\Controllers\Tool\HistoryIssueModalController;
use App\Http\Controllers\Tool\IssueController;
use App\Http\Controllers\Tool\Main\GroupController;
use App\Http\Controllers\Tool\Main\NomController;
use App\Http\Controllers\Tool\Main\ParamController;
use App\Http\Controllers\Tool\Main\TreeController;
use App\Http\Controllers\Tool\Reports\Email\BuchEndPartController;
use App\Http\Controllers\Tool\Reports\Email\OrderToolsController as EmailVueOrderToolsController;
use App\Http\Controllers\Tool\Reports\Email\RevisionToolsController;
use App\Http\Controllers\Tool\Reports\Vue\OrderToolsController as VueOrderToolsController; // Изменено имя, чтобы избежать конфликта


// Маршруты для API
Route::group(['prefix' => 'api', 'middleware' => 'auth:api'], function () {
    Route::get('/user', [LoginController::class, 'getUser']);
});

// 'Аутентификация'
Route::post('login', [LoginController::class, 'login']);
Route::post('check-login', [LoginController::class, 'checkLogin']);
Route::get('database-info', [LoginController::class, 'getDatabaseInfo']);

// "Инструмент"
Route::prefix('tool')->group(function () {
    Route::get('s/', [NomController::class, 'getTools']);
    Route::get('s/{id}', [NomController::class, 'getToolById']);
    Route::post('/', [NomController::class, 'addTool']);
    Route::put('s/{id}', [NomController::class, 'editTool']);
    Route::delete('s/{id}', [NomController::class, 'deleteTool']);
    Route::get('s/filters/{parent_id}', [NomController::class, 'getFilterParamsByParentId']);
});

// "Параметры"
Route::get('tools-params', [ParamController::class, 'getToolParams']);
Route::post('tools-params', [ParamController::class, 'addToolParam']);
Route::put('tools-params/{id}', [ParamController::class, 'updateToolParam']);
Route::delete('tools-params/{id}', [ParamController::class, 'deleteToolParam']);
// "Параметры дополнительно"
Route::patch('tools-params/{id}/move', [ParamController::class, 'moveToolParam']);

// "Дерево"
Route::get('tools-tree', [TreeController::class, 'getToolsTree']);
Route::post('tools-tree', [TreeController::class, 'addBranch']); // x
Route::put('tools-tree', [TreeController::class, 'updateFolderTree']); // x
Route::delete('tools-tree/{id}', [TreeController::class, 'deleteFolderTree']);  // x

// "Выдача инструмента"
Route::post('issues', [IssueController::class, 'issueTools']);
Route::get('cnc', [IssueController::class, 'getCncData']); // форма заполнения
Route::get('operators/fio', [IssueController::class, 'getFioOperators']); // форма заполнения
Route::get('issue/cancel-operation-admin/{id}', [IssueController::class, 'cancelOperationAdmin']); // отмена операции (админ)
Route::post('issue/cancel-operation/{id}', [IssueController::class, 'cancelOperation']); // отмена операции (3 дня)

// "История выдачи"
Route::get('history', [HistoryIssueController::class, 'getToolHistory']);
Route::get('history-all-tool', [HistoryIssueController::class, 'getAllIssuedToolIdsWithNames']); // инструмент для поиска

// "История выдачи Modal"
Route::get('history-part', [HistoryIssueModalController::class, 'getToolHistoryByPartId']); // история (основной список)
Route::get('history-part/info', [HistoryIssueModalController::class, 'getToolHistoryByPartIdInfo']); // история (информация по партии)
Route::post('history-add-archive', [HistoryIssueModalController::class, 'addToArchive']); // архив истории выдачи

// "Движение инструмента"
Route::get('tool-movement/{id}', [HistoryIssueController::class, 'getToolMovementById']);

// "Группы"
Route::get('tools-groups', [GroupController::class, 'getGroupedTools']);

// "Поврежденный инструмент"
Route::get('damaged-history', [HistoryDamagedController::class, 'getDamaged']);
Route::post('tool-history-damaged', [HistoryDamagedController::class, 'addToolHistoryDamaged']);

// "Email report"
Route::get('report/zayav-instr', [EmailOrderToolsController::class, 'genZayavInstr']); // заявка на инструмент
Route::get('report/revision-instr', [RevisionToolsController::class, 'genRevisionInstr']); // заявка на ревизию инструмента
// "Email report Buch *CRON"
Route::get('report/buch-end-op', [BuchEndPartController::class, 'checkStatusChanges']); // в режиме CRON

// "Vue"
Route::get('report/get-zakaz', [VueOrderToolsController::class, 'getTableReportData']); // заявка на инструмент (Vue)
Route::get('report/getBuchWeek', [BuchWeekController::class, 'getTableReportData']); // бухгалтерия (Vue)

Route::get('qr-code', [QrCodeController::class, 'getQrCodeData']);
Route::post('qr-code', [QrCodeController::class, 'addQrCodeData']);

Route::get('/orders', [OrderToolsController::class, 'getOrdersData']);

// Ресурсный маршрут
Route::resource('posts', \App\Http\Controllers\ToolsNom\GetToolsController::class);
