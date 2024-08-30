<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    // Получение информации о базе данных
    public function getDatabaseInfo(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            // Используем фиксированное значение connectionName
            $connectionName = 'default'; // Замените на ваше значение подключения

            // Получаем информацию о подключении к базе данных
            $connection = DB::connection($connectionName);
            $localIp = $connection->getConfig('host'); // IP адрес сервера базы данных
            $databaseType = $connection->getConfig('driver'); // Тип базы данных (например, 'mysql', 'pgsql')
            $dbName = $connection->getDatabaseName(); // Имя базы данных

            // Получаем внешний IP-адрес сервера
            $externalIp = $request->server('SERVER_ADDR');

            // Определяем databaseType на основе внешнего IP
            if ($externalIp === '192.168.0.11') {
                $databaseType = 'build';
            }

            // Создаем ответ в формате JSON
            $dbInfo = [
                'localIp' => $localIp,
                'databaseType' => $databaseType,
                'dbName' => $dbName,
                'connectionName' => $connectionName,
                'externalIp' => $externalIp // Добавляем внешний IP в ответ
            ];

            return response()->json($dbInfo);
        } catch (\Exception $e) {
            Log::error('Ошибка при получении информации о базе данных: ' . $e->getMessage());
            return response()->json(['error' => 'Ошибка сервера'], 500);
        }
    }

    // Логин пользователя
    public function login(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'login' => 'required|string',
                'password' => 'required|string',
            ]);

            $user = DB::table('dbo.vue_users')
                ->where('login', $validatedData['login'])
                ->first();

            if ($user && $user->password === $validatedData['password']) {
                $token = Str::uuid();
                $now = now();
                $userIP = $request->ip();

                DB::table('dbo.vue_users')
                    ->where('login', $validatedData['login'])
                    ->update([
                        'token' => $token,
                        'last_login_date' => $now,
                        'last_login_ip' => $userIP,
                    ]);

                return response()->json(['status' => 'ok', 'token' => $token]);
            } else {
                return response()->json(['status' => 'error', 'message' => 'Неправильный логин или пароль'], 401);
            }
        } catch (\Exception $e) {
            Log::error('Ошибка при логине: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Внутренняя ошибка сервера'], 500);
        }
    }

    // Проверка токена
    public function checkLogin(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'token' => 'required|string',
            ]);

            $user = DB::table('dbo.vue_users')
                ->where('token', $validatedData['token'])
                ->first();

            if ($user) {
                $role = $user->role; // Предполагаем, что колонка с ролью называется 'role'

                return response()->json(['status' => 'ok', 'user' => $user->login, 'role' => $role]);
            } else {
                return response()->json(['status' => 'error', 'message' => 'Недействительный токен'], 401);
            }
        } catch (\Exception $e) {
            Log::error('Ошибка при проверке токена: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Внутренняя ошибка сервера'], 500);
        }
    }
}
