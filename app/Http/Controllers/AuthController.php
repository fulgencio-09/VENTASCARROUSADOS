<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            'user' => $this->withEffectivePermissions($result['user']),
            'token' => $result['token'],
        ]);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $this->authService->register($request->validated());

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
            'user' => $this->withEffectivePermissions($loginResult['user']),
            'token' => $loginResult['token'],
        ], 201);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'user' => $this->withEffectivePermissions($user->load(['profile', 'roles', 'dealers'])),
        ]);
    }

    private function withEffectivePermissions(User $user): User
    {
        $rolePermissions = $user->roles()
            ->with('permissions')
            ->get()
            ->flatMap(fn ($role) => $role->permissions->pluck('name'));

        $directPermissions = $user->permissions()->pluck('name');

        $user->setAttribute(
            'permissions',
            $rolePermissions->merge($directPermissions)->unique()->values()->all()
        );

        return $user;
    }
}
