<?php

use App\Http\Controllers\AdminDataController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->prefix('admin')->group(function (): void {
    Route::get('/users', [AdminDataController::class, 'users'])
        ->middleware('permission:usuarios.ver');
    Route::post('/users', [AdminDataController::class, 'storeUser'])
        ->middleware('permission:usuarios.crear');
    Route::put('/users/{user}', [AdminDataController::class, 'updateUser'])
        ->middleware('permission:usuarios.editar');
    Route::patch('/users/{user}/status', [AdminDataController::class, 'changeUserStatus'])
        ->middleware('permission:usuarios.cambiar_estado');
    Route::patch('/users/{user}/role', [AdminDataController::class, 'changeUserRole'])
        ->middleware('permission:usuarios.cambiar_rol');
    Route::post('/users/{user}/reset-password', [AdminDataController::class, 'resetUserPassword'])
        ->middleware('permission:usuarios.restablecer_password');
    Route::delete('/users/{user}', [AdminDataController::class, 'destroyUser'])
        ->middleware('permission:usuarios.eliminar');

    Route::get('/roles', [AdminDataController::class, 'roles'])
        ->middleware('permission:roles.ver');
    Route::put('/roles/{role}/permissions', [AdminDataController::class, 'updateRolePermissions'])
        ->middleware('permission:roles.asignar_permisos');

    Route::get('/permissions', [AdminDataController::class, 'permissions'])
        ->middleware('permission:permisos.ver');
    Route::post('/permissions', [AdminDataController::class, 'storePermission'])
        ->middleware('permission:permisos.crear');
    Route::put('/permissions/{permission}', [AdminDataController::class, 'updatePermission'])
        ->middleware('permission:permisos.editar');
    Route::delete('/permissions/{permission}', [AdminDataController::class, 'destroyPermission'])
        ->middleware('permission:permisos.eliminar');
});