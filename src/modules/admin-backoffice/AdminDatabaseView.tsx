import React, { useEffect, useMemo, useState } from 'react';
import { Check, Edit3, KeyRound, Plus, RefreshCw, Shield, Trash2, Users } from 'lucide-react';
import { adminApi, AdminPermission, AdminRole, AdminUser } from '../../core/admin/admin.api';
import { PermissionGate } from '../../core/auth/PermissionGate';

const ROLES = ['vendedor_particular', 'concesionario', 'administrador', 'superadministrador'] as const;
type RoleName = typeof ROLES[number];
type Tab = 'usuarios' | 'roles' | 'permisos';

const emptyUser = {
  email: '', password: '', status: 'active' as const, role: 'vendedor_particular' as RoleName,
  first_name: '', last_name: '', document_type: '', document_number: '', phone: '', whatsapp: '', address: '',
};

export const AdminDatabaseView: React.FC = () => {
  const [tab, setTab] = useState<Tab>('usuarios');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState(emptyUser);
  const [editingPermission, setEditingPermission] = useState<AdminPermission | null>(null);
  const [permissionForm, setPermissionForm] = useState({ name: '', description: '' });
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  const selectedRole = useMemo(() => roles.find((role) => role.id === selectedRoleId) ?? null, [roles, selectedRoleId]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, rolesResponse, permissionsResponse] = await Promise.all([
        adminApi.users(),
        adminApi.roles(),
        adminApi.permissions(),
      ]);
      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
      setPermissions(permissionsResponse.data);
      const firstRole = rolesResponse.data[0];
      setSelectedRoleId((current) => current ?? firstRole?.id ?? null);
      setSelectedPermissionIds(firstRole?.permissions.map((permission) => permission.id) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cargar la información administrativa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    setSelectedPermissionIds(selectedRole?.permissions.map((permission) => permission.id) ?? []);
  }, [selectedRoleId, roles]);

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

  const saveRolePermissions = async () => {
    if (!selectedRole) return;
    try {
      const response = await adminApi.updateRolePermissions(selectedRole.id, selectedPermissionIds);
      setRoles((current) => current.map((role) => role.id === response.role.id ? response.role : role));
      notify(`Permisos de ${selectedRole.name} actualizados.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible actualizar los permisos del rol.');
    }
  };

  const savePermission = async () => {
    try {
      if (editingPermission) {
        const response = await adminApi.updatePermission(editingPermission.id, permissionForm);
        setPermissions((current) => current.map((item) => item.id === editingPermission.id ? response.permission : item));
        notify('Permiso actualizado correctamente.');
      } else {
        const response = await adminApi.createPermission(permissionForm);
        setPermissions((current) => [...current, response.permission]);
        notify('Permiso creado correctamente.');
      }
      setEditingPermission(null);
      setPermissionForm({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible guardar el permiso.');
    }
  };

  const deletePermission = async (permission: AdminPermission) => {
    if ((permission.roles_count ?? 0) > 0) {
      setError('El permiso está asignado a un rol y no se puede eliminar.');
      return;
    }
    if (!window.confirm(`¿Eliminar el permiso ${permission.name}?`)) return;
    try {
      await adminApi.deletePermission(permission.id);
      setPermissions((current) => current.filter((item) => item.id !== permission.id));
      notify('Permiso eliminado correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible eliminar el permiso.');
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
            <p className="text-slate-500 mt-1">Cada operación administrativa se valida con el permiso correspondiente en el backend.</p>
          </div>
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"><RefreshCw size={16} /> Actualizar</button>
        </div>

        {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{notice}</div>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        <div className="flex flex-wrap gap-2 rounded-2xl border bg-white p-2">
          <PermissionGate permission="usuarios.ver"><button onClick={() => setTab('usuarios')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'usuarios' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}><Users className="inline mr-2" size={16} />Usuarios</button></PermissionGate>
          <PermissionGate permission="roles.ver"><button onClick={() => setTab('roles')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'roles' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}><Shield className="inline mr-2" size={16} />Roles y permisos</button></PermissionGate>
          <PermissionGate permission="permisos.ver"><button onClick={() => setTab('permisos')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'permisos' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}><KeyRound className="inline mr-2" size={16} />Catálogo de permisos</button></PermissionGate>
        </div>

        {tab === 'usuarios' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-2xl border bg-white">
              <div className="flex items-center justify-between border-b p-5"><h2 className="font-bold">Usuarios registrados ({users.length})</h2><PermissionGate permission="usuarios.crear"><button onClick={() => { setEditingUser(null); setUserForm(emptyUser); }} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} />Nuevo usuario</button></PermissionGate></div>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-3">Usuario</th><th className="p-3">Rol</th><th className="p-3">Estado</th><th className="p-3">Acciones</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t"><td className="p-3"><div className="font-semibold">{[user.profile?.first_name, user.profile?.last_name].filter(Boolean).join(' ') || 'Sin nombre'}</div><div className="text-xs text-slate-500">{user.email}</div></td><td className="p-3">{user.roles[0]?.name ?? 'Sin rol'}</td><td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{user.status}</span></td><td className="p-3"><div className="flex gap-2"><PermissionGate permission="usuarios.editar"><button onClick={() => editUser(user)} className="rounded-lg border p-2" title="Editar"><Edit3 size={15} /></button></PermissionGate><PermissionGate permission="usuarios.eliminar"><button onClick={() => void deleteUser(user)} className="rounded-lg border border-red-200 p-2 text-red-600" title="Eliminar"><Trash2 size={15} /></button></PermissionGate></div></td></tr>)}</tbody></table></div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <h2 className="font-bold mb-4">{editingUser ? 'Editar usuario' : 'Registrar usuario'}</h2>
              <div className="space-y-3">
                <input className="w-full rounded-xl border px-3 py-2" placeholder="Correo electrónico" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                <input className="w-full rounded-xl border px-3 py-2" placeholder={editingUser ? 'Nueva contraseña (requiere restablecer_password)' : 'Contraseña'} type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
                <div className="grid grid-cols-2 gap-2"><input className="rounded-xl border px-3 py-2" placeholder="Nombres" value={userForm.first_name} onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })} /><input className="rounded-xl border px-3 py-2" placeholder="Apellidos" value={userForm.last_name} onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })} /></div>
                {editingUser ? <PermissionGate permission="usuarios.cambiar_rol"><select className="w-full rounded-xl border px-3 py-2" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as RoleName })}>{ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select></PermissionGate> : <select className="w-full rounded-xl border px-3 py-2" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as RoleName })}>{ROLES.map((role) => <option key={role} value={role}>{role}</option>)}</select>}
                {editingUser ? <PermissionGate permission="usuarios.cambiar_estado"><select className="w-full rounded-xl border px-3 py-2" value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value as AdminUser['status'] })}><option value="active">Activo</option><option value="inactive">Inactivo</option><option value="suspended">Suspendido</option></select></PermissionGate> : <select className="w-full rounded-xl border px-3 py-2" value={userForm.status} onChange={(e) => setUserForm({ ...userForm, status: e.target.value as AdminUser['status'] })}><option value="active">Activo</option><option value="inactive">Inactivo</option><option value="suspended">Suspendido</option></select>}
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
            <div className="rounded-2xl border bg-white p-4 space-y-2">{roles.map((role) => <button key={role.id} onClick={() => setSelectedRoleId(role.id)} className={`w-full rounded-xl p-3 text-left ${selectedRoleId === role.id ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}><div className="font-semibold">{role.name}</div><div className="text-xs opacity-70">{role.users_count} usuarios</div></button>)}</div>
            <div className="rounded-2xl border bg-white p-5"><h2 className="font-bold">Permisos de {selectedRole?.name ?? 'rol'}</h2><p className="text-sm text-slate-500 mb-5">El superadministrador puede definir qué operaciones tiene cada uno de los cuatro roles oficiales.</p><div className="grid gap-3 md:grid-cols-2">{permissions.map((permission) => <label key={permission.id} className="flex items-start gap-3 rounded-xl border p-3"><input type="checkbox" checked={selectedPermissionIds.includes(permission.id)} onChange={(e) => setSelectedPermissionIds((current) => e.target.checked ? [...current, permission.id] : current.filter((id) => id !== permission.id))} /><span><span className="block font-semibold">{permission.name}</span><span className="text-xs text-slate-500">{permission.description}</span></span></label>)}</div><PermissionGate permission="roles.asignar_permisos"><button onClick={() => void saveRolePermissions()} className="mt-5 rounded-xl bg-orange-600 px-5 py-2 font-semibold text-white">Guardar permisos</button></PermissionGate></div>
          </div>
        )}

        {tab === 'permisos' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-2xl border bg-white"><div className="flex items-center justify-between border-b p-5"><h2 className="font-bold">Permisos ({permissions.length})</h2><PermissionGate permission="permisos.crear"><button onClick={() => { setEditingPermission(null); setPermissionForm({ name: '', description: '' }); }} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} />Nuevo permiso</button></PermissionGate></div><div className="divide-y">{permissions.map((permission) => <div key={permission.id} className="flex items-center justify-between gap-4 p-4"><div><div className="font-semibold">{permission.name}</div><div className="text-xs text-slate-500">{permission.description || 'Sin descripción'} · {permission.roles_count ?? 0} roles</div></div><div className="flex gap-2"><PermissionGate permission="permisos.editar"><button onClick={() => { setEditingPermission(permission); setPermissionForm({ name: permission.name, description: permission.description ?? '' }); }} className="rounded-lg border p-2"><Edit3 size={15} /></button></PermissionGate><PermissionGate permission="permisos.eliminar"><button onClick={() => void deletePermission(permission)} className="rounded-lg border border-red-200 p-2 text-red-600"><Trash2 size={15} /></button></PermissionGate></div></div>)}</div></div>
            <div className="rounded-2xl border bg-white p-5"><h2 className="font-bold mb-4">{editingPermission ? 'Editar permiso' : 'Registrar permiso'}</h2><div className="space-y-3"><input className="w-full rounded-xl border px-3 py-2" placeholder="Nombre, ejemplo: clientes.ver" value={permissionForm.name} onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })} /><textarea className="w-full rounded-xl border px-3 py-2" placeholder="Descripción" rows={4} value={permissionForm.description} onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })} /><PermissionGate permission={editingPermission ? 'permisos.editar' : 'permisos.crear'}><button onClick={() => void savePermission()} className="w-full rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white">Guardar permiso</button></PermissionGate></div></div>
          </div>
        )}
      </div>
    </section>
  );
};
