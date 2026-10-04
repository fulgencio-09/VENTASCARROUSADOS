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
     * Registra transaccionalmente un nuevo usuario en la plataforma con su perfil asociado.
     *
     * @param  array{email: string, password: string, status?: string}  $userData  Datos validados del usuario
     * @param  array<string, mixed>|null  $profileData  Datos validados del perfil (opcional)
     * @return User  Instancia del usuario persistido con su relación de perfil cargada
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
     * Autentica a un usuario verificando credenciales, gobernando rate limiting y emitiendo token.
     *
     * @param  string  $email  Correo electrónico del usuario
     * @param  string  $password  Contraseña en texto plano
     * @param  string|null  $throttleKey  Clave de rate limiting (ej. 'login:ip|email')
     * @param  string  $tokenName  Nombre identificador del token (por defecto 'auth-token')
     * @param  array<int, string>  $abilities  Habilidades o permisos asociados al token
     * @return array{user: User, token: string}  Array estructurado con usuario autenticado y token de acceso
     *
     * @throws AuthenticationException  Si las credenciales son inválidas o se excede el rate limit
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

        if ($throttleKey !== null) {
            RateLimiter::clear($throttleKey);
        }

        $token = $this->issueToken($user, $tokenName, $abilities);

        return [
            'user'  => $user->load('profile'),
            'token' => $token,
        ];
    }

    /**
     * Emite un token de acceso personal para el usuario.
     *
     * @param  User  $user  Usuario para el cual se emite el token
     * @param  string  $tokenName  Identificador del token
     * @param  array<int, string>  $abilities  Habilidades concedidas
     * @return string  Token en texto plano para el cliente
     */
    protected function issueToken(User $user, string $tokenName = 'auth-token', array $abilities = ['*']): string
    {
        $tokenResult = $user->createToken($tokenName, $abilities);

        return $tokenResult->plainTextToken;
    }
}
