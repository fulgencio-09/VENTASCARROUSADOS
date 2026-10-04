/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Gestor de Estado de Autenticación y Sesión
 */

import { User, UserRole, AuthSession } from '../../domain/user/user.entity';
import { APP_CONFIG } from '../config/app.config';

// Usuarios de prueba preconfigurados para cada uno de los roles clave
export const DEMO_USERS: Record<UserRole, User> = {
  visitante: {
    id: 'usr-guest-00',
    name: 'Visitante Anónimo',
    email: '',
    role: 'visitante',
    isActive: true,
    isKycVerified: false,
    createdAt: '2026-10-01',
  },
  cliente: {
    id: 'usr-client-01',
    name: 'Carolina Miranda',
    email: 'carolina.miranda@gmail.com',
    role: 'cliente',
    phone: '+56 9 8812 4321',
    isActive: true,
    isKycVerified: true,
    createdAt: '2026-05-10',
  },
  vendedor_particular: {
    id: 'usr-part-02',
    name: 'Rodrigo Espinoza',
    email: 'rodrigo.espinoza@hotmail.com',
    role: 'vendedor_particular',
    phone: '+56 9 7654 3210',
    isActive: true,
    isKycVerified: true,
    createdAt: '2026-02-14',
  },
  concesionario: {
    id: 'usr-dealer-03',
    name: 'AutoCenter Los Andes',
    email: 'contacto@autocenter.cl',
    role: 'concesionario',
    phone: '+56 9 8452 1190',
    isActive: true,
    isKycVerified: true,
    dealerProfile: {
      businessName: 'AutoCenter Los Andes SpA',
      taxId: '76.452.190-8',
      tradeName: 'AutoCenter Los Andes',
      rating: 4.9,
      reviewsCount: 84,
      city: 'Santiago',
    },
    createdAt: '2024-03-15',
  },
  moderador: {
    id: 'usr-mod-04',
    name: 'Esteban Morales',
    email: 'esteban.moderador@automarket.pro',
    role: 'moderador',
    isActive: true,
    isKycVerified: true,
    createdAt: '2025-01-20',
  },
  administrador: {
    id: 'usr-admin-05',
    name: 'Valeria Cárdenas',
    email: 'valeria.admin@automarket.pro',
    role: 'administrador',
    isActive: true,
    isKycVerified: true,
    createdAt: '2024-08-01',
  },
  superadministrador: {
    id: 'usr-super-06',
    name: 'Arquitecto Principal',
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
    // Inicializar con concesionario por defecto para testing del portal de ventas
    const savedUserJson = localStorage.getItem(APP_CONFIG.storageKeys.authUser);
    let initialUser: User = DEMO_USERS.concesionario;

    if (savedUserJson) {
      try {
        initialUser = JSON.parse(savedUserJson);
      } catch {
        initialUser = DEMO_USERS.concesionario;
      }
    }

    this.currentSession = {
      user: initialUser,
      token: initialUser.role === 'visitante' ? null : 'mock-jwt-sanctum-token-xyz',
      isAuthenticated: initialUser.role !== 'visitante',
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
      token: newRole === 'visitante' ? null : 'mock-jwt-token-' + newRole,
      isAuthenticated: newRole !== 'visitante',
    };
    localStorage.setItem(APP_CONFIG.storageKeys.authUser, JSON.stringify(newUser));
    this.notify();
  }

  public registerClient(name: string, email: string, phone: string): void {
    const newClient: User = {
      id: `usr-client-${Date.now()}`,
      name: name || 'Nuevo Cliente Registrado',
      email: email || 'cliente@automarket.pro',
      role: 'cliente',
      phone: phone || '+56 9 8812 4321',
      isActive: true,
      isKycVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.currentSession = {
      user: newClient,
      token: 'jwt-sanctum-client-' + Date.now(),
      isAuthenticated: true,
    };
    localStorage.setItem(APP_CONFIG.storageKeys.authUser, JSON.stringify(newClient));
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
