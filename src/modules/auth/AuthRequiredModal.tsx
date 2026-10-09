/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal de autenticación para acceder a funciones protegidas.
 * Visitantes y clientes no son roles del sistema y no se registran como tales.
 */

import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Mail, UserCheck } from 'lucide-react';
import { AuthStateManager } from '../../core/auth/auth.state';
import { UserRole } from '../../domain/user/user.entity';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  actionContextText?: string;
}

const LOGIN_ROLES: Array<{ value: UserRole; label: string }> = [
  { value: 'vendedor_particular', label: 'Vendedor Particular' },
  { value: 'concesionario', label: 'Concesionario' },
  { value: 'administrador', label: 'Administrador' },
  { value: 'superadministrador', label: 'Superadministrador' },
];

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  actionContextText = 'continuar',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('vendedor_particular');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mientras el frontend demo no consuma todavía el endpoint Laravel/Sanctum,
    // el rol seleccionado representa únicamente el escenario de prueba de RBAC.
    AuthStateManager.getInstance().switchRole(role);
    onAuthenticated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-70 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600">
            <Lock className="w-4 h-4" />
            <h3 className="font-display font-bold text-sm text-slate-900">Inicio de sesión requerido</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Acceso protegido
            </span>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              Para {actionContextText} debes iniciar sesión con uno de los roles autenticables de AutoMarket Pro.
              Los visitantes pueden consultar las publicaciones sin iniciar sesión.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Correo electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@automarket.pro"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Rol de prueba RBAC</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              >
                {LOGIN_ROLES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Iniciar sesión
            </button>
          </form>

          <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
            El rol <strong>Administrador</strong> no se registra libremente: su asignación corresponde al <strong>Superadministrador</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
