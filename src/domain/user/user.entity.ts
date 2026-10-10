/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Contratos de Dominio: Identidad, Roles, Perfiles y permisos efectivos
 */

export type UserRole =
  | 'vendedor_particular'
  | 'concesionario'
  | 'administrador'
  | 'superadministrador';

export interface UserPermission {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  isKycVerified: boolean;
  dealerProfile?: {
    businessName: string;
    taxId: string;
    tradeName?: string;
    rating: number;
    reviewsCount: number;
    city: string;
  };
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
