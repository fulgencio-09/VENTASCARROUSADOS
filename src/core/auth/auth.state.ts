/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Gestor de Estado de Autenticación y Sesión
 */

import { User, UserRole, AuthSession } from '../../domain/user/user.entity';
import { APP_CONFIG } from '../config/app.config';

type ApiUser = {
  id: number;
  uuid?: string;
  email: string;
  status: string;
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  } | null;
  roles?: Array<{ id: number; name: string }>;
  dealers?: Array<{
    legal_name: string;
    commercial_name: string;
    nit: string;
    city_id?: number | null;
  }>;
  is_kyc_verified?: boolean;
};

export interface RegisterPayload {
  role: 'vendedor_particular' | 'concesionario';
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  document_type?: string;
  document_number?: string;
  phone: string;
  whatsapp?: string;
  city_id?: number;
  address?: string;
  legal_name?: string;
  commercial_name?: string;
  nit?: string;
  dealer_email?: string;
  dealer_phone?: string;
  dealer_whatsapp?: string;
  website?: string;
  dealer_city_id?: number;
  dealer_address?: string;
}

interface AuthResponse {
  message: string;
  user: ApiUser;
  token: string;
}

function normalizeUser(raw: ApiUser): User {
  const role = raw.roles?.[0]?.name as UserRole | undefined;

  if (!role) {
    throw new Error('La API no devolvió un rol autenticable para el usuario.');
  }

  const firstName = raw.profile?.first_name?.trim() ?? '';
  const lastName = raw.profile?.last_name?.trim() ?? '';
  const dealer = raw.dealers?.[0];

  return {
    id: raw.uuid ?? String(raw.id),
    name: [firstName, lastName].filter(Boolean).join(' ') || raw.email,
    email: raw.email,
    role,
    phone: raw.profile?.phone ?? raw.profile?.whatsapp ?? undefined,
    isActive: raw.status === 'active',
    isKycVerified: Boolean(raw.is_kyc_verified),
    dealerProfile: dealer
      ? {
          businessName: dealer.legal_name,
          taxId: dealer.nit,
          tradeName: dealer.commercial_name,
          rating: 0,
          reviewsCount: 0,
          city: dealer.city_id ? String(dealer.city_id) : '',
        }
      : undefined,
    createdAt: new Date().toISOString(),
  };
}

async function requestAuth(path: string, payload: Record<string, unknown>): Promise<AuthResponse> {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = data?.errors
      ? Object.values(data.errors as Record<string, string[]>).flat().join(' ')
      : null;
    throw new Error(validationMessage || data?.message || 'No fue posible completar la operación.');
  }

  return data as AuthResponse;
}

export class AuthStateManager {
  private static instance: AuthStateManager;
  private currentSession: AuthSession;
  private listeners: Array<(session: AuthSession) => void> = [];

  private constructor() {
    const savedUserJson = localStorage.getItem(APP_CONFIG.storageKeys.authUser);
    const savedToken = localStorage.getItem(APP_CONFIG.storageKeys.authToken);
    let initialUser: User | null = null;

    if (savedUserJson && savedToken) {
      try {
        const savedUser = JSON.parse(savedUserJson) as User;
        initialUser = savedUser;
      } catch {
        localStorage.removeItem(APP_CONFIG.storageKeys.authUser);
        localStorage.removeItem(APP_CONFIG.storageKeys.authToken);
      }
    }

    this.currentSession = {
      user: initialUser,
      token: savedToken,
      isAuthenticated: initialUser !== null && savedToken !== null,
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

  public async login(email: string, password: string): Promise<AuthSession> {
    const response = await requestAuth('/auth/login', { email, password });
    const user = normalizeUser(response.user);
    this.setSession(user, response.token);
    return this.currentSession;
  }

  public async register(payload: RegisterPayload): Promise<AuthSession> {
    const response = await requestAuth('/auth/register', payload as unknown as Record<string, unknown>);
    const user = normalizeUser(response.user);
    this.setSession(user, response.token);
    return this.currentSession;
  }

  public logout(): void {
    this.currentSession = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
    localStorage.removeItem(APP_CONFIG.storageKeys.authUser);
    localStorage.removeItem(APP_CONFIG.storageKeys.authToken);
    this.notify();
  }

  public subscribe(callback: (session: AuthSession) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentSession);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private setSession(user: User, token: string): void {
    this.currentSession = {
      user,
      token,
      isAuthenticated: true,
    };
    localStorage.setItem(APP_CONFIG.storageKeys.authUser, JSON.stringify(user));
    localStorage.setItem(APP_CONFIG.storageKeys.authToken, token);
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((cb) => cb(this.currentSession));
  }
}
