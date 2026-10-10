import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit3, Plus, RefreshCw, Shield, Trash2, Users } from 'lucide-react';
import { adminApi, AdminRole, AdminUser } from '../../core/admin/admin.api';
import { PermissionGate } from '../../core/auth/PermissionGate';
import { ROLE_DEFINITIONS, getRoleDefinition } from './roleDefinitions';

const ROLES = ['vendedor_particular', 'concesionario', 'administrador', 'superadministrador'] as const;
type RoleName = typeof ROLES[number];
type Tab = 'usuarios' | 'roles';

const emptyUser = {
  email: '', password: '', status: 'active' as const, role: 'vendedor_particular' as RoleName,
  first_name: '', last_name: '', document_type: '', document_number: '', phone: '', whatsapp: '', address: '',
};

export const AdminDatabaseView: React.FC = () => {
  const [tab, setTab] = useState<Tab>('usuarios');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState(emptyUser);
  const [selectedRoleName, setSelectedRoleName] = useState<RoleName>('superadministrador');

  const selectedRole = useMemo(
    () => roles.find((role) => role.name === selectedRoleName) ?? null,
    [roles, selectedRoleName],
  );
  const selectedDefinition = getRoleDefinition(selectedRoleName)!;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        adminApi.users(),
        adminApi.roles(),
      ]);
      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cargar la información administrativa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 3500);
  };

  const saveUser = async () => {
    setError(null);
    try {
      if (editingUser) {
        const response = await adminApi.updateUser(editingUser.id, {
          email: userForm.email,
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          document_type: userForm.document_type,
          document_number: userForm.document_number,
          phone: userForm.phone,
          whatsapp: userForm.whatsapp,
          address: userForm.address,
        });
        let updatedUser = response.user;

        if (userForm.status !== editingUser.status) {
          updatedUser = (await adminApi.changeUserStatus(editingUser.id, userForm.status)).user;
        }

        const currentRole = editingUser.roles[0]?.name ?? 'vendedor_particular';
        if (userForm.role !== currentRole) {
          updatedUser = (await adminApi.changeUserRole(editingUser.id, userForm.role)).user;
        }

        if (userForm.password) {
          await adminApi.resetUserPassword(editingUser.id, userForm.password);
        }

        setUsers((current) => current.map((item) => item.id === editingUser.id ? updatedUser : item));
        notify('Usuario actualizado correctamente.');
      } else {
        const response = await adminApi.createUser(userForm);
        setUsers((current) => [response.user, ...current]);
        notify('Usuario creado correctamente.');
      }
      setEditingUser(null);
      setUserForm(emptyUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible guardar el usuario.');
    }
  };

  const editUser = (user: AdminUser) => {
    const role = user.roles[0]?.name;
    setEditingUser(user);
    setUserForm({
      email: user.email,
      password: '',
      status: user.status,
      role: (ROLES.includes(role as RoleName) ? role : 'vendedor_particular') as RoleName,
      first_name: user.profile?.first_name ?? '',
      last_name: user.profile?.last_name ?? '',
      document_type: user.profile?.document_type ?? '',
      document_number: user.profile?.document_number ?? '',
      phone: user.profile?.phone ?? '',
      whatsapp: user.profile?.whatsapp ?? '',
      address: user.profile?.address ?? '',
    });
    setTab('usuarios');
  };

  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`¿Eliminar al usuario ${user.email}?`)) return;
    try {
      await adminApi.deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      notify('Usuario eliminado correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible eliminar el usuario.');
    }
  };

  if (loading) {
    return <div className="min-h-[500px] flex items-center justify-center"><RefreshCw className="animate-spin" size={28} /></div>;
  }

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Administración</p>
            <h1 className="text-3xl font-bold text-slate-900">Gestión de información</h1>
            <p className="text-slate-500 mt-1">Las funciones visibles se definen internamente según el rol del usuario.</p>
          </div>
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"><RefreshCw size={16} /> Actualizar</button>
        </div>

        {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{notice}</div>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        <div className="flex flex-wrap gap-2 rounded-2xl border bg-white p-2">
          <PermissionGate permission="usuarios.ver">
            <button onClick={() => setTab('usuarios')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'usuarios' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}><Users className="inline mr-2" size={16} />Usuarios</button>
          </PermissionGate>
          <PermissionGate permission="roles.ver">
            <button onClick={() => setTab('roles')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'roles' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}><Shield className="inline mr-2" size={16} />Roles</button>
          </PermissionGate>
        </div>

        {tab === 'usuarios' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-2xl border bg-white">
              <div className="flex items-center justify-between border-b p-5">
                <h2 className="font-bold">Usuarios registrados ({users.length})</h2>
                <PermissionGate permission="usuarios.crear">
                  <button onClick={() => { setEditingUser(null); setUserForm(emptyUser); }} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} />Nuevo usuario</button>
                </PermissionGate>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-3">Usuario</th><th className="p-3">Rol</th><th className="p-3">Estado</th><th className="p-3">Acciones</th></tr></thead>
                  <tbody>{users.map((user) => <tr key={user.id} className="border-t">
                    <td className="p-3"><div className="font-semibold">{[user.profile?.first_name, user.profile?.last_name].filter(Boolean).join(' ') || 'Sin nombre'}</div><div className="text-xs text-slate-500">{user.email}</div></td>
                    <td className="p-3">{user.roles[0]?.name ?? 'Sin rol'}</td>
                    <td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{user.status}</span></td>
                    <td className="p-3"><div className="flex gap-2"><PermissionGate permission="usuarios.editar"><button onClick={() => editUser(user)} className="rounded-lg border p-2" title="Editar"><Edit3 size={15} /></button></PermissionGate><PermissionGate permission="usuarios.eliminar"><button onClick={() => void deleteUser(user)} className="rounded-lg border border-red-200 p-2 text-red-600" title="Eliminar"><Trash2 size={15} /></button></PermissionGate></div></td>
                  </tr>)}</tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <h2 className="font-bold mb-4">{editingUser ? 'Editar usuario' : 'Registrar usuario'}</h2>
              <div className="space-y-3">
                <input className="w-full rounded-xl border px-3 py-2" placeholder="Correo electrónico" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                <input className="w-full rounded-xl border px-3 py-2" placeholder={editingUser ? 'Nueva contraseña' : 'Contraseña'} type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                <div className="grid grid-cols-2 gap-2"><input className="rounded-xl border px-3 py-2" placeholder="Nombres" value={userForm.first_name} onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })} /><input className="rounded-xl border px-3 py-2" placeholder="Apellidos" value={userForm.last_name} onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })} /></div>
                <select className="w-full rounded-xl border px-3 py-2" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as RoleName })}>{ROLES.map((role) => <option key={role} value={role}>{getRoleDefinition(role)?.label ?? role}</option>)}</select>
                <select className="w-full rounded-xl border px-3 py-2" value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value as AdminUser['status'] })}><option value="active">Activo</option><option value="inactive">Inactivo</option><option value="suspended">Suspendido</option></select>
                <input className="w-full rounded-xl border px-3 py-2" placeholder="Teléfono" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
                <input className="w-full rounded-xl border px-3 py-2" placeholder="WhatsApp" value={userForm.whatsapp} onChange={(e) => setUserForm({ ...userForm, whatsapp: e.target.value })} />
                <input className="w-full rounded-xl border px-3 py-2" placeholder="Dirección" value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} />
                <div className="flex gap-2"><button onClick={() => void saveUser()} className="flex-1 rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white"><Check className="inline mr-1" size={16} />Guardar</button>{editingUser && <button onClick={() => { setEditingUser(null); setUserForm(emptyUser); }} className="rounded-xl border px-4 py-2">Cancelar</button>}</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'roles' && (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <div className="rounded-2xl border bg-white p-4 space-y-2">
              {ROLE_DEFINITIONS.map((definition) => {
                const role = roles.find((item) => item.name === definition.name);
                return <button key={definition.name} onClick={() => setSelectedRoleName(definition.name)} className={`w-full rounded-xl p-3 text-left ${selectedRoleName === definition.name ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}>
                  <div className="font-semibold">{definition.label}</div>
                  <div className="text-xs opacity-70">{role?.users_count ?? 0} usuarios</div>
                </button>;
              })}
            </div>

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-start justify-between gap-4 border-b pb-5">
                <div><p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Rol del sistema</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{selectedDefinition.label}</h2><p className="mt-2 text-slate-500">{selectedDefinition.description}</p></div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{selectedRole?.users_count ?? 0} usuarios</span>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div><h3 className="mb-3 font-bold">Módulos que debe visualizar</h3><div className="flex flex-wrap gap-2">{selectedDefinition.visibleModules.map((module) => <span key={module} className="rounded-lg border bg-slate-50 px-3 py-2 text-sm">{module}</span>)}</div></div>
                <div><h3 className="mb-3 font-bold">Responsabilidades</h3><ul className="space-y-2 text-sm text-slate-600">{selectedDefinition.capabilities.map((capability) => <li key={capability} className="rounded-lg border p-3">{capability}</li>)}</ul></div>
              </div>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                Las capacidades de este rol son definidas internamente por AutoMarket Pro. El administrador no modifica permisos técnicos desde esta pantalla.
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
