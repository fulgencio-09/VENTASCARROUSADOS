<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class SuperAdminSeeder extends Seeder
{
    /**
     * Crea el primer Superadministrador usando exclusivamente valores del .env local.
     * No se almacenan credenciales ni datos personales en el repositorio.
     */
    public function run(): void
    {
        $email = mb_strtolower(trim((string) env('AUTOMARKET_SUPERADMIN_EMAIL')));
        $password = (string) env('AUTOMARKET_SUPERADMIN_PASSWORD');
        $firstName = trim((string) env('AUTOMARKET_SUPERADMIN_FIRST_NAME'));
        $lastName = trim((string) env('AUTOMARKET_SUPERADMIN_LAST_NAME'));

        if ($email === '' || $password === '' || $firstName === '' || $lastName === '') {
            throw new RuntimeException(
                'Debe configurar AUTOMARKET_SUPERADMIN_EMAIL, AUTOMARKET_SUPERADMIN_PASSWORD, AUTOMARKET_SUPERADMIN_FIRST_NAME y AUTOMARKET_SUPERADMIN_LAST_NAME en el .env local.'
            );
        }

        $role = Role::query()
            ->where('name', 'superadministrador')
            ->where('guard_name', 'web')
            ->first();

        if (!$role) {
            throw new RuntimeException(
                'El rol superadministrador no existe. Ejecute primero las migraciones de AutoMarket Pro.'
            );
        }

        if (User::query()->where('email', $email)->exists()) {
            throw new RuntimeException("Ya existe un usuario con el correo {$email}. No se sobrescribió.");
        }

        $user = User::create([
            'email' => $email,
            'password' => Hash::make($password),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $user->profile()->create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'document_type' => env('AUTOMARKET_SUPERADMIN_DOCUMENT_TYPE') ?: null,
            'document_number' => env('AUTOMARKET_SUPERADMIN_DOCUMENT_NUMBER') ?: null,
            'phone' => env('AUTOMARKET_SUPERADMIN_PHONE') ?: null,
            'whatsapp' => env('AUTOMARKET_SUPERADMIN_WHATSAPP') ?: null,
            'city_id' => env('AUTOMARKET_SUPERADMIN_CITY_ID') ?: null,
            'address' => env('AUTOMARKET_SUPERADMIN_ADDRESS') ?: null,
        ]);

        $user->roles()->attach($role->id);

        $this->command?->info("Superadministrador creado: {$email}");
    }
}
