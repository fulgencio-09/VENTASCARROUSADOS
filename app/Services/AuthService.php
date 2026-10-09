<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class AuthService
{
    /**
     * Roles que pueden autenticar en AutoMarket Pro.
     * Visitante, cliente y moderador no son roles válidos.
     *
     * @var array<int, string>
     */
    private const AUTHENTICATABLE_ROLES = [
        'vendedor_particular',
        'concesionario',
        'administrador',
        'superadministrador',
    ];

    /**
     * Registra transaccionalmente un nuevo usuario en la plataforma con su perfil asociado.
     *
     * La asignación de roles no se realiza durante el registro general.
     * Los roles se asignan mediante el flujo RBAC autorizado.
     *
     * @param  array{email: string, password: string, status?: string}  $userData
     * @param  array<string, mixed>|null  $profileData
     * @return User
     */
    public function register(array $userData, ?array $profileData = null): User
    {
        return DB::transaction(function () use ($userData, $profileData) {
            /** @var User $user */
            $user = User::create([
                'email'    => $userData['email'],
                'password' => Hash::make($userData['password']),
                'status'   => $userData['status'] ?? 'active',
            ]);

            if (!empty($profileData)) {
                $user->profile()->create($profileData);
            }

            return $user->load('profile');
        });
    }

    /**
     * Autentica a un usuario verificando credenciales, rate limiting y RBAC.
     * Solo usuarios con uno de los cuatro roles aprobados pueden iniciar sesión.
     *
     * @param  string  $email
     * @param  string  $password
     * @param  string|null  $throttleKey
     * @param  string  $tokenName
     * @param  array<int, string>  $abilities
     * @return array{user: User, token: string}
     *
     * @throws AuthenticationException
     */
    public function login(
        string $email,
        string $password,
        ?string $throttleKey = null,
        string $tokenName = 'auth-token',
        array $abilities = ['*']
    ): array {
        if ($throttleKey !== null && RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw new AuthenticationException(
                "Demasiados intentos fallidos de inicio de sesión. Por favor reintente en {$seconds} segundos."
            );
        }

        /** @var User|null $user */
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            if ($throttleKey !== null) {
                RateLimiter::hit($throttleKey, 60);
            }

            throw new AuthenticationException('Credenciales de acceso incorrectas.');
        }

        if ($user->status === 'inactive' || $user->status === 'suspended') {
            throw new AuthenticationException('La cuenta de usuario se encuentra inactiva o suspendida.');
        }

        $user->load('roles');

        $assignedRoles = $user->roles
            ->pluck('name')
            ->filter(fn (mixed $role): bool => in_array($role, self::AUTHENTICATABLE_ROLES, true))
            ->values();

        if ($assignedRoles->count() !== 1) {
            throw new AuthenticationException(
                'El usuario no tiene exactamente un rol autenticable asignado. Solicite la asignación correspondiente al Superadministrador.'
            );
        }

        if ($throttleKey !== null) {
            RateLimiter::clear($throttleKey);
        }

        $token = $this->issueToken($user, $tokenName, $abilities);

        return [
            'user'  => $user->load('profile', 'roles'),
            'token' => $token,
        ];
    }

    /**
     * Emite un token de acceso personal para el usuario.
     *
     * @param  User  $user
     * @param  string  $tokenName
     * @param  array<int, string>  $abilities
     * @return string
     */
    protected function issueToken(User $user, string $tokenName = 'auth-token', array $abilities = ['*']): string
    {
        $tokenResult = $user->createToken($tokenName, $abilities);

        return $tokenResult->plainTextToken;
    }
}
