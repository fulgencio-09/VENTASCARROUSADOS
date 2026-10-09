/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Top Bar Contract: Exactamente 3 zonas, sin píldoras decorativas, wordmark único
 */

import React, { useState, useEffect } from 'react';
import { AuthStateManager } from '../../core/auth/auth.state';
import { UserRole } from '../../domain/user/user.entity';
import { ShieldCheck, UserCheck, Car, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenPublish: () => void;
  comparisonCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenPublish,
  comparisonCount,
}) => {
  const [session, setSession] = useState(AuthStateManager.getInstance().getSession());
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    return AuthStateManager.getInstance().subscribe(setSession);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    AuthStateManager.getInstance().switchRole(role);
    setShowRoleMenu(false);
  };

  const roleLabels: Record<UserRole, string> = {
    vendedor_particular: 'Vendedor Particular',
    concesionario: 'Concesionario',
    administrador: 'Administrador',
    superadministrador: 'Superadministrador',
  };

  const activeRole = session.user?.role;
  const activeRoleLabel = activeRole ? roleLabels[activeRole] : 'Sin sesión';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* ZONA 1: Wordmark de Marca Único */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-amber-500 font-bold text-lg shadow-sm">
              <Car className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              AutoMarket <span className="text-amber-600">Pro</span>
            </span>
          </button>
        </div>

        {/* ZONA 2: Enlaces de navegación */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('catalog')}
            className={`hover:text-slate-900 transition-colors cursor-pointer ${
              currentView === 'catalog' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''
            }`}
          >
            Catálogo de Vehículos
          </button>
          <button
            onClick={() => onNavigate('compare')}
            className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer ${
              currentView === 'compare' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''
            }`}
          >
            Comparador
            {comparisonCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-mono font-semibold bg-amber-500 text-white rounded-full">
                {comparisonCount}
              </span>
            )}
          </button>

          {(activeRole === 'vendedor_particular' || activeRole === 'concesionario') && (
            <button
              onClick={() => onNavigate('seller_dashboard')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${
                currentView === 'seller_dashboard' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''
              }`}
            >
              Panel de Vendedor
            </button>
          )}

          {(activeRole === 'administrador' || activeRole === 'superadministrador') && (
            <button
              onClick={() => onNavigate('admin_dashboard')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${
                currentView === 'admin_dashboard' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-amber-500 decoration-2' : ''
              }`}
            >
              Panel de Administración
            </button>
          )}
        </nav>

        {/* ZONA 3: Acciones primarias + selector de prueba RBAC */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
              title="Cambiar rol activo para probar permisos y vistas"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline text-slate-500">Rol:</span>
              <span className="font-semibold text-slate-900">{activeRoleLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cambiar Rol Activo (RBAC)
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeRole === r ? 'font-semibold text-amber-700 bg-amber-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{roleLabels[r]}</span>
                    {activeRole === r && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenPublish}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all shadow-sm hover:shadow whitespace-nowrap cursor-pointer"
          >
            + Publicar Vehículo
          </button>
        </div>

      </div>
    </header>
  );
};
