<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;

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
}
