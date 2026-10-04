/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Contratos de Dominio: Identidad, Roles y Perfiles
 */

export type UserRole = 
  | 'visitante'
  | 'cliente'
  | 'vendedor_particular'
  | 'concesionario'
  | 'moderador'
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
