import { APP_CONFIG } from '../config/app.config';
import { AuthStateManager } from '../auth/auth.state';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = AuthStateManager.getInstance().getSession().token;
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = data?.errors
      ? Object.values(data.errors as Record<string, string[]>).flat().join(' ')
      : null;
    throw new Error(validationMessage || data?.message || 'No fue posible completar la operación.');
  }

  return data as T;
}

export type AdminUser = {
  id: number;
  uuid: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    document_type?: string | null;
    document_number?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    city_id?: number | null;
    address?: string | null;
  } | null;
  roles: Array<{ id: number; name: string }>;
};

export type AdminRole = {
  id: number;
  name: string;
  guard_name: string;
  description: string | null;
  users_count: number;
  permissions: AdminPermission[];
};

export type AdminPermission = {
  id: number;
  name: string;
  guard_name: string;
  description: string | null;
  roles_count?: number;
};

export type PaginatedUsers = {
  data: AdminUser[];
  current_page: number;
  last_page: number;
  total: number;
};

export const adminApi = {
  users: () => request<PaginatedUsers>('/admin/users?per_page=100'),
  createUser: (payload: Record<string, unknown>) => request<{ user: AdminUser }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateUser: (id: number, payload: Record<string, unknown>) => request<{ user: AdminUser }>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  changeUserStatus: (id: number, status: AdminUser['status']) => request<{ user: AdminUser }>(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  changeUserRole: (id: number, role: string) => request<{ user: AdminUser }>(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  }),
  resetUserPassword: (id: number, password: string) => request<{ message: string }>(`/admin/users/${id}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
  deleteUser: (id: number) => request<{ message: string }>(`/admin/users/${id}`, {
    method: 'DELETE',
  }),
  roles: () => request<{ data: AdminRole[] }>('/admin/roles'),
  updateRolePermissions: (id: number, permissionIds: number[]) => request<{ role: AdminRole }>(`/admin/roles/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permission_ids: permissionIds }),
  }),
  permissions: () => request<{ data: AdminPermission[] }>('/admin/permissions'),
  createPermission: (payload: { name: string; description?: string }) => request<{ permission: AdminPermission }>('/admin/permissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updatePermission: (id: number, payload: { name?: string; description?: string }) => request<{ permission: AdminPermission }>(`/admin/permissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  deletePermission: (id: number) => request<{ message: string }>(`/admin/permissions/${id}`, {
    method: 'DELETE',
  }),
};