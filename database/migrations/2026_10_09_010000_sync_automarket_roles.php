<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Sincroniza el catálogo de roles con la definición aprobada de AutoMarket Pro.
     *
     * Roles válidos:
     * - vendedor_particular
     * - concesionario
     * - administrador
     * - superadministrador
     *
     * Visitante y cliente no son roles del sistema.
     * Moderador tampoco es un rol: la función de moderación corresponde al administrador.
     */
    public function up(): void
    {
        if (!Schema::hasTable('roles')) {
            return;
        }

        DB::transaction(function (): void {
            // Eliminar asignaciones de roles obsoletos antes de eliminar sus registros.
            if (Schema::hasTable('model_has_roles')) {
                $obsoleteRoleIds = DB::table('roles')
                    ->whereIn('name', ['visitante', 'cliente', 'moderador'])
                    ->pluck('id');

                if ($obsoleteRoleIds->isNotEmpty()) {
                    DB::table('model_has_roles')
                        ->whereIn('role_id', $obsoleteRoleIds)
                        ->delete();
                }
            }

            DB::table('roles')
                ->whereIn('name', ['visitante', 'cliente', 'moderador'])
                ->delete();

            $roles = [
                [
                    'name' => 'vendedor_particular',
                    'guard_name' => 'web',
                    'description' => 'Usuario autenticado que publica y administra vehículos propios.',
                ],
                [
                    'name' => 'concesionario',
                    'guard_name' => 'web',
                    'description' => 'Usuario autenticado asociado a un concesionario.',
                ],
                [
                    'name' => 'administrador',
                    'guard_name' => 'web',
                    'description' => 'Usuario administrativo que gestiona la operación y moderación de la plataforma.',
                ],
                [
                    'name' => 'superadministrador',
                    'guard_name' => 'web',
                    'description' => 'Máximo nivel administrativo. Puede gestionar y asignar roles administrativos.',
                ],
            ];

            foreach ($roles as $role) {
                DB::table('roles')->updateOrInsert(
                    [
                        'name' => $role['name'],
                        'guard_name' => $role['guard_name'],
                    ],
                    [
                        'description' => $role['description'],
                        'updated_at' => now(),
                    ]
                );
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('roles')) {
            return;
        }

        DB::transaction(function (): void {
            $roleIds = DB::table('roles')
                ->whereIn('name', [
                    'vendedor_particular',
                    'concesionario',
                    'administrador',
                    'superadministrador',
                ])
                ->pluck('id');

            if (Schema::hasTable('model_has_roles') && $roleIds->isNotEmpty()) {
                DB::table('model_has_roles')
                    ->whereIn('role_id', $roleIds)
                    ->delete();
            }

            DB::table('roles')
                ->whereIn('name', [
                    'vendedor_particular',
                    'concesionario',
                    'administrador',
                    'superadministrador',
                ])
                ->delete();
        });
    }
};
