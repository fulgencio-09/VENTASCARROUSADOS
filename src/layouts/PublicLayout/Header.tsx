/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Top Bar Contract: navegación pública + autenticación real
 */

import React, { useEffect, useState } from 'react';
import { AuthStateManager } from '../../core/auth/auth.state';
import { UserRole } from '../../domain/user/user.entity';
import { UserCheck, Car, LogIn, UserPlus, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenPublish: () => void;
  comparisonCount: number;
}

const openAuth = (mode: 'login' | 'register') => {
  window.dispatchEvent(new CustomEvent('automarket:open-auth', { detail: { mode } }));
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenPublish,
  comparisonCount,
}) => {
  const [session, setSession] = useState(AuthStateManager.getInstance().getSession());

  useEffect(() => AuthStateManager.getInstance().subscribe(setSession), []);

  const roleLabels: Record<UserRole, string> = {
    vendedor_particular: 'Vendedor Particular',
    concesionario: 'Concesionario',
    administrador: 'Administrador',
    superadministrador: 'Superadministrador',
  };

  const activeRole = session.user?.role;
  const activeRoleLabel = activeRole ? roleLabels[activeRole] : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group text-left cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-amber-500 font-bold text-lg shadow-sm">
              <Car className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              AutoMarket <span className="text-amber-600">Pro</span>
            </span>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={() => onNavigate('catalog')} className={`hover:text-slate-900 transition-colors cursor-pointer ${currentView === 'catalog' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''}`}>
            Catálogo de Vehículos
          </button>
          <button onClick={() => onNavigate('compare')} className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer ${currentView === 'compare' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''}`}>
            Comparador
            {comparisonCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-mono font-semibold bg-amber-500 text-white rounded-full">{comparisonCount}</span>}
          </button>

          {(activeRole === 'vendedor_particular' || activeRole === 'concesionario') && (
            <button onClick={() => onNavigate('seller_dashboard')} className={`hover:text-slate-900 transition-colors cursor-pointer ${currentView === 'seller_dashboard' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''}`}>
              Panel de Vendedor
            </button>
          )}

          {activeRole === 'superadministrador' && (
            <button onClick={() => onNavigate('admin_dashboard')} className={`hover:text-slate-900 transition-colors cursor-pointer ${currentView === 'admin_dashboard' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''}`}>
              Panel de Administración
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!session.isAuthenticated ? (
            <>
              <button onClick={() => openAuth('login')} className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer">
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </button>
              <button onClick={() => openAuth('register')} className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                <UserPlus className="w-4 h-4" />
                Registrarme
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg">
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline text-slate-500">Rol:</span>
                <span className="font-semibold text-slate-900">{activeRoleLabel}</span>
              </div>
              <button onClick={() => AuthStateManager.getInstance().logout()} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}

          <button onClick={onOpenPublish} className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all shadow-sm hover:shadow whitespace-nowrap cursor-pointer">
            + Publicar Vehículo
          </button>
        </div>
      </div>
    </header>
  );
};
