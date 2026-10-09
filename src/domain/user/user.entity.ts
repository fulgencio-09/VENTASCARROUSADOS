/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Contratos de Dominio: Identidad, Roles y Perfiles
 */

/**
 * Roles autenticables del sistema.
 *
 * Visitantes y clientes no son roles: son usuarios no autenticados que
 * únicamente pueden consultar las publicaciones públicas.
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
  id: string; // UUID v7
  name: string;
  email: string;
  role: UserRole;
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
