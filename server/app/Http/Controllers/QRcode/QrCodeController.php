<?php

namespace App\Http\Controllers\QRcode;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Carbon\Carbon;

class QrCodeController extends Controller
{

    public function getQrCodeData(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $perPage = $request->input('perPage', 15);
            $page = $request->input('page', 1);

            $qrCodes = DB::table('qr_code')
                ->paginate($perPage, ['*'], 'page', $page);

            $data = [
                'currentPage' => $qrCodes->currentPage(),
                'itemsPerPage' => (int)$qrCodes->perPage(), // Ensure integer type
                'totalCount' => $qrCodes->total(),
                'data' => $qrCodes->items(),
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Error retrieving qr_code data: ' . $e->getMessage());
            Log::error('Error Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function addQrCodeData(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'specs_nom_id' => 'required|integer',
                'specs_nom_operations_id' => 'required|integer',
                'color' => 'required|string|max:255',
                'sizes' => 'required|string|max:255',
                'smena' => 'required|integer',
                'quantity_box' => 'required|integer',
                'quantity_prod' => 'required|integer',
                'status' => 'required|string|max:255',
            ]);

            // Получаем текущую дату и время
            $now = Carbon::now();

            $newQrCodeId = DB::table('qr_code')->insertGetId([
                'specs_nom_id' => $validatedData['specs_nom_id'],
                'specs_nom_operations_id' => $validatedData['specs_nom_operations_id'],
                'color' => $validatedData['color'],
                'sizes' => $validatedData['sizes'],
                'smena' => $validatedData['smena'],
                'status' => $validatedData['status'],
                'quantity_box' => $validatedData['quantity_box'],
                'quantity_prod' => $validatedData['quantity_prod'],
                'created_at' => $now, // Добавляем created_at
            ]);

            if ($newQrCodeId) {
                // Получаем все данные только что добавленного QR-кода
                $addedQrCode = DB::table('qr_code')->where('id', $newQrCodeId)->first();

                return response()->json([
                    'message' => 'QR code added successfully',
                    'qr_code' => $addedQrCode // Возвращаем данные добавленного QR-кода
                ], 201);
            } else {
                return response()->json(['error' => 'Failed to add QR code'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error adding QR code data: ' . $e->getMessage());
            Log::error('Error Trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
