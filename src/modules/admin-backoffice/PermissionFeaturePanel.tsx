import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleOff, RefreshCw, ShieldCheck } from 'lucide-react';
import { adminApi, AdminPermission, AdminRole } from '../../core/admin/admin.api';

const MODULE_LABELS: Record<string, string> = {
  usuarios: 'Usuarios',
  clientes: 'Clientes',
  vendedores: 'Vendedores',
  concesionarios: 'Concesionarios',
  dealer_branches: 'Sucursales de concesionarios',
  vehiculos: 'Vehículos',
  publicaciones: 'Publicaciones',
  moderacion: 'Moderación',
  planes: 'Planes de publicación',
  pagos: 'Pagos',
  facturas: 'Facturas',
  leads: 'Leads',
  lead_interactions: 'Interacciones de leads',
  test_drive: 'Pruebas de conducción',
  mensajes: 'Mensajes',
  publicidad: 'Publicidad',
  reportes: 'Reportes',
  configuracion: 'Configuración',
  roles: 'Roles',
  permisos: 'Permisos',
  auditoria: 'Auditoría',
  logs: 'Logs',
};

const ACTION_LABELS: Record<string, string> = {
  ver: 'Consultar',
  crear: 'Crear',
  editar: 'Editar',
  eliminar: 'Eliminar',
  cambiar_estado: 'Cambiar estado',
  cambiar_rol: 'Cambiar rol',
  restablecer_password: 'Restablecer contraseña',
  cambiar_propietario: 'Cambiar propietario',
  gestionar_media: 'Gestionar fotografías y archivos',
  publicar: 'Publicar',
  pausar: 'Pausar',
  reanudar: 'Reanudar',
  rechazar: 'Rechazar',
  suspender: 'Suspender',
  marcar_vendido: 'Marcar como vendido',
  destacar: 'Destacar',
  asignar: 'Asignar',
  revisar: 'Revisar',
  aprobar: 'Aprobar',
  ver_historial: 'Ver historial',
  activar: 'Activar',
  desactivar: 'Desactivar',
  consultar: 'Consultar detalle',
  cancelar: 'Cancelar',
  reembolsar: 'Reembolsar',
  reconciliar: 'Reconciliar',
  anular: 'Anular',
  descargar: 'Descargar',
  exportar: 'Exportar',
  marcar_leido: 'Marcar como leído',
  archivar: 'Archivar',
  bloquear: 'Bloquear',
  enviar: 'Enviar',
  completar: 'Completar',
  confirmar: 'Confirmar',
  marcar_no_show: 'Marcar no presentado',
  asignar_permisos: 'Asignar permisos',
  asignar_rol: 'Asignar a rol',
};

function featureText(permission: AdminPermission): { module: string; action: string; description: string } {
  const [moduleKey, ...actionParts] = permission.name.split('.');
  const actionKey = actionParts.join('_');
  const module = MODULE_LABELS[moduleKey] ?? moduleKey.replaceAll('_', ' ');
  const action = ACTION_LABELS[actionKey] ?? actionKey.replaceAll('_', ' ');
  return {
    module,
    action,
    description: permission.description || `Permite ${action.toLowerCase()} en ${module.toLowerCase()}.`,
  };
}

export const PermissionFeaturePanel: React.FC = () => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([adminApi.roles(), adminApi.permissions()]);
      setRoles(rolesResponse.data);
      setPermissions(permissionsResponse.data);
      setSelectedRoleId((current) => current ?? rolesResponse.data[0]?.id ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId]
  );

  const activeIds = useMemo(
    () => new Set(selectedRole?.permissions.map((permission) => permission.id) ?? []),
    [selectedRole]
  );

  const visiblePermissions = useMemo(
    () => permissions.filter((permission) => !showOnlyActive || activeIds.has(permission.id)),
    [permissions, activeIds, showOnlyActive]
  );

  const activeCount = activeIds.size;
  const inactiveCount = Math.max(permissions.length - activeCount, 0);

  if (loading) {
    return <div className="rounded-2xl border bg-white p-6 text-slate-500"><RefreshCw className="mr-2 inline animate-spin" size={16} />Cargando funcionalidades gobernadas…</div>;
  }

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={20} /><h2 className="text-lg font-bold text-slate-900">Funcionalidades activadas por permisos</h2></div>
          <p className="mt-1 text-sm text-slate-500">Aquí se visualiza qué operaciones quedan habilitadas para cada rol según las casillas marcadas.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-xl border px-3 py-2 text-sm font-semibold" value={selectedRoleId ?? ''} onChange={(e) => setSelectedRoleId(Number(e.target.value))}>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>
          <button type="button" onClick={() => void load()} className="rounded-xl border p-2" title="Actualizar"><RefreshCw size={16} /></button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Activos</div><div className="mt-1 text-2xl font-bold text-emerald-800">{activeCount}</div></div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Inactivos</div><div className="mt-1 text-2xl font-bold text-slate-800">{inactiveCount}</div></div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-blue-700">Catálogo</div><div className="mt-1 text-2xl font-bold text-blue-800">{permissions.length}</div></div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-b pb-3">
        <span className="text-sm font-semibold text-slate-700">{selectedRole?.name ?? 'Rol'} · {activeCount} funcionalidades activadas</span>
        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={showOnlyActive} onChange={(e) => setShowOnlyActive(e.target.checked)} />Solo activadas</label>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {visiblePermissions.map((permission) => {
          const active = activeIds.has(permission.id);
          const feature = featureText(permission);
          return (
            <div key={permission.id} className={`rounded-xl border p-3 ${active ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start gap-2">
                {active ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} /> : <CircleOff className="mt-0.5 shrink-0 text-slate-400" size={18} />}
                <div className="min-w-0"><div className="font-semibold text-slate-900">{feature.module} · {feature.action}</div><div className="mt-1 text-xs text-slate-500">{permission.name}</div><div className="mt-1 text-xs text-slate-600">{feature.description}</div></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
