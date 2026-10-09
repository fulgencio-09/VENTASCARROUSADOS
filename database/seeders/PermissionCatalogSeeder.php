<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionCatalogSeeder extends Seeder
{
    /**
     * Catálogo central de permisos de AutoMarket Pro.
     *
     * Este seeder es idempotente: puede ejecutarse varias veces
     * sin duplicar permisos. No asigna permisos a roles.
     */
    public function run(): void
    {
        $catalog = [
            'usuarios' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'cambiar_estado',
                'cambiar_rol',
                'restablecer_password',
            ],
            'clientes' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'cambiar_estado',
            ],
            'vendedores' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'cambiar_estado',
            ],
            'concesionarios' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'cambiar_estado',
            ],
            'dealer_branches' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'cambiar_estado',
            ],
            'vehiculos' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'cambiar_propietario',
                'gestionar_media',
            ],
            'publicaciones' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'publicar',
                'pausar',
                'reanudar',
                'rechazar',
                'suspender',
                'marcar_vendido',
                'destacar',
            ],
            'moderacion' => [
                'ver',
                'asignar',
                'revisar',
                'aprobar',
                'rechazar',
                'suspender',
                'ver_historial',
            ],
            'planes' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'activar',
                'desactivar',
            ],
            'pagos' => [
                'ver',
                'consultar',
                'aprobar',
                'rechazar',
                'cancelar',
                'reembolsar',
                'reconciliar',
            ],
            'facturas' => [
                'ver',
                'crear',
                'consultar',
                'anular',
                'descargar',
            ],
            'leads' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'asignar',
                'cambiar_estado',
            ],
            'lead_interactions' => [
                'ver',
                'crear',
            ],
            'test_drive' => [
                'ver',
                'crear',
                'editar',
                'cancelar',
                'confirmar',
                'completar',
                'marcar_no_show',
            ],
            'mensajes' => [
                'ver',
                'enviar',
                'marcar_leido',
                'archivar',
                'bloquear',
            ],
            'publicidad' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'activar',
                'desactivar',
            ],
            'reportes' => [
                'ver',
                'exportar',
            ],
            'configuracion' => [
                'ver',
                'editar',
            ],
            'roles' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'asignar_permisos',
            ],
            'permisos' => [
                'ver',
                'crear',
                'editar',
                'eliminar',
                'asignar_rol',
            ],
            'auditoria' => [
                'ver',
                'exportar',
            ],
            'logs' => [
                'ver',
                'exportar',
            ],
        ];

        foreach ($catalog as $module => $actions) {
            foreach ($actions as $action) {
                Permission::findOrCreate(
                    $module . '.' . $action,
                    'web'
                );
            }
        }
    }
}
