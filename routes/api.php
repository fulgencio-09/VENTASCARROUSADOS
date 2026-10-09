<?php

use App\Http\Controllers\AdminDataController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function (): void {
    Route::get('/users', [AdminDataController::class, 'users']);
    Route::post('/users', [AdminDataController::class, 'storeUser']);
    Route::put('/users/{user}', [AdminDataController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminDataController::class, 'destroyUser']);

    Route::get('/roles', [AdminDataController::class, 'roles']);
    Route::put('/roles/{role}/permissions', [AdminDataController::class, 'updateRolePermissions']);

    Route::get('/permissions', [AdminDataController::class, 'permissions']);
    Route::post('/permissions', [AdminDataController::class, 'storePermission']);
    Route::put('/permissions/{permission}', [AdminDataController::class, 'updatePermission']);
    Route::delete('/permissions/{permission}', [AdminDataController::class, 'destroyPermission']);
});
