/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Gestor de Estado de Autenticación y Sesión
 */

import { User, UserRole, AuthSession } from '../../domain/user/user.entity';
import { APP_CONFIG } from '../config/app.config';

// Usuarios de prueba únicamente para los cuatro roles autenticables aprobados.
export const DEMO_USERS: Record<UserRole, User> = {
  vendedor_particular: {
    id: 'usr-part-02',
    name: 'Rodrigo Espinoza',
    email: 'rodrigo.espinoza@automarket.pro',
    role: 'vendedor_particular',
    phone: '+57 300 000 0000',
    isActive: true,
    isKycVerified: true,
    createdAt: '2026-02-14',
  },
  concesionario: {
    id: 'usr-dealer-03',
    name: 'AutoCenter Colombia',
    email: 'contacto@autocenter.automarket.pro',
    role: 'concesionario',
    phone: '+57 300 000 0001',
    isActive: true,
    isKycVerified: true,
    dealerProfile: {
      businessName: 'AutoCenter Colombia S.A.S.',
      taxId: '900000000-1',
      tradeName: 'AutoCenter Colombia',
      rating: 4.9,
      reviewsCount: 84,
      city: 'Bogotá',
    },
    createdAt: '2024-03-15',
  },
  administrador: {
    id: 'usr-admin-05',
    name: 'Administrador del Sistema',
    email: 'administrador@automarket.pro',
    role: 'administrador',
    isActive: true,
    isKycVerified: true,
    createdAt: '2024-08-01',
  },
  superadministrador: {
    id: 'usr-super-06',
    name: 'Superadministrador',
    email: 'superadmin@automarket.pro',
    role: 'superadministrador',
    isActive: true,
    isKycVerified: true,
    createdAt: '2024-01-01',
  },
};

export class AuthStateManager {
  private static instance: AuthStateManager;
  private currentSession: AuthSession;
  private listeners: Array<(session: AuthSession) => void> = [];

  private constructor() {
    // Mantener el usuario demo de concesionario para la visualización actual.
    // No existe un rol de visitante: una sesión no autenticada se representa
    // con user = null.
    const savedUserJson = localStorage.getItem(APP_CONFIG.storageKeys.authUser);
    let initialUser: User | null = DEMO_USERS.concesionario;

    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson) as User;
        initialUser = Object.prototype.hasOwnProperty.call(DEMO_USERS, savedUser.role)
          ? savedUser
          : DEMO_USERS.concesionario;
      } catch {
        initialUser = DEMO_USERS.concesionario;
      }
    }

    this.currentSession = {
      user: initialUser,
      token: initialUser ? 'mock-jwt-sanctum-token-xyz' : null,
      isAuthenticated: initialUser !== null,
    };
  }

  public static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }

  public getSession(): AuthSession {
    return this.currentSession;
  }

  public switchRole(newRole: UserRole): void {
    const newUser = DEMO_USERS[newRole];
    this.currentSession = {
      user: newUser,
      token: 'mock-jwt-token-' + newRole,
      isAuthenticated: true,
    };
    localStorage.setItem(APP_CONFIG.storageKeys.authUser, JSON.stringify(newUser));
    this.notify();
  }

  public logout(): void {
    this.currentSession = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
    localStorage.removeItem(APP_CONFIG.storageKeys.authUser);
    this.notify();
  }

  public subscribe(callback: (session: AuthSession) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentSession);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => cb(this.currentSession));
  }
}
