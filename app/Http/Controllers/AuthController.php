<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $email = mb_strtolower(trim($request->validated('email')));
        $password = $request->validated('password');

        $throttleKey = 'login:' . $email . '|' . $request->ip();

        try {
            $result = $this->authService->login(
                $email,
                $password,
                $throttleKey
            );
        } catch (AuthenticationException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 401);
        }

        return response()->json([
            'message' => 'Inicio de sesión exitoso.',
            'user' => $result['user'],
            'token' => $result['token'],
        ]);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = $this->authService->register($request->validated());

            $loginResult = $this->authService->login(
                mb_strtolower(trim($request->validated('email'))),
                $request->validated('password')
            );
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        } catch (AuthenticationException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 401);
        }

        return response()->json([
            'message' => 'Registro exitoso. Bienvenido a AutoMarket Pro.',
            'user' => $loginResult['user'],
            'token' => $loginResult['token'],
        ], 201);
    }
}
