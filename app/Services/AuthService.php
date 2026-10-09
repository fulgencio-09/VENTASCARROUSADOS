<?php

namespace App\Services;

use App\Models\Dealer;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use RuntimeException;

class AuthService
{
    private const AUTHENTICATABLE_ROLES = [
        'vendedor_particular',
        'concesionario',
        'administrador',
        'superadministrador',
    ];

    private const PUBLIC_REGISTRATION_ROLES = [
        'vendedor_particular',
        'concesionario',
    ];

    /**
     * Registra una cuenta pública como vendedor particular o concesionario.
     * Para concesionario también crea el dealer y vincula al usuario como owner.
     * Todo el proceso es atómico.
     *
     * @param array<string, mixed> $data
     */
    public function register(array $data): User
    {
        $roleName = $data['role'];

        if (!in_array($roleName, self::PUBLIC_REGISTRATION_ROLES, true)) {
            throw new RuntimeException('El rol solicitado no puede registrarse públicamente.');
        }

        return DB::transaction(function () use ($data, $roleName) {
            $role = Role::where('name', $roleName)
                ->where('guard_name', 'web')
                ->first();

            if (!$role) {
                throw new RuntimeException("El rol {$roleName} no existe en la configuración RBAC.");
            }

            /** @var User $user */
            $user = User::create([
                'email' => mb_strtolower(trim($data['email'])),
                'password' => Hash::make($data['password']),
                'status' => 'active',
            ]);

            $user->profile()->create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'document_type' => $data['document_type'] ?? null,
                'document_number' => $data['document_number'] ?? null,
                'phone' => $data['phone'],
                'whatsapp' => $data['whatsapp'] ?? null,
                'city_id' => $data['city_id'] ?? null,
                'address' => $data['address'] ?? null,
            ]);

            $user->roles()->attach($role->id);

            if ($roleName === 'concesionario') {
                /** @var Dealer $dealer */
                $dealer = Dealer::create([
                    'uuid' => (string) Str::uuid(),
                    'legal_name' => $data['legal_name'],
                    'commercial_name' => $data['commercial_name'],
                    'nit' => $data['nit'],
                    'email' => $data['dealer_email'] ?? $data['email'],
                    'phone' => $data['dealer_phone'] ?? $data['phone'],
                    'whatsapp' => $data['dealer_whatsapp'] ?? ($data['whatsapp'] ?? null),
                    'website' => $data['website'] ?? null,
                    'city_id' => $data['dealer_city_id'] ?? ($data['city_id'] ?? null),
                    'address' => $data['dealer_address'] ?? ($data['address'] ?? null),
                    'status' => 'active',
                ]);

                $dealer->users()->attach($user->id, [
                    'role_in_dealer' => 'owner',
                    'status' => 'active',
                ]);
            }

            return $user->load('profile', 'roles', 'dealers');
        });
    }

    /**
     * Autentica a un usuario verificando credenciales, rate limiting y RBAC.
     * Solo usuarios con uno de los cuatro roles aprobados pueden iniciar sesión.
     *
     * @return array{user: User, token: string}
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
            'user' => $user->load('profile', 'roles', 'dealers'),
            'token' => $token,
        ];
    }

    protected function issueToken(User $user, string $tokenName = 'auth-token', array $abilities = ['*']): string
    {
        $tokenResult = $user->createToken($tokenName, $abilities);

        return $tokenResult->plainTextToken;
    }
}
