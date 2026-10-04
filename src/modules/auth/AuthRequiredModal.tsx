/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modal de Registro / Autenticación Obligatoria para Visitantes antes de Contactar o Guardar Favorito
 */

import React, { useState } from 'react';
import { X, Lock, UserCheck, ShieldCheck, Mail, ArrowRight, UserPlus, Phone } from 'lucide-react';
import { AuthStateManager } from '../../core/auth/auth.state';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  actionContextText?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  actionContextText = 'contactar al vendedor',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      AuthStateManager.getInstance().registerClient(
        name || 'Carolina Miranda',
        email || 'carolina.miranda@gmail.com',
        phone || '+56 9 8812 4321'
      );
    } else {
      AuthStateManager.getInstance().switchRole('cliente');
    }
    onAuthenticated();
    onClose();
  };

  const handleQuickDemoClient = () => {
    AuthStateManager.getInstance().switchRole('cliente');
    onAuthenticated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-70 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden flex flex-col">
        
        {/* Cabecera */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600">
            <Lock className="w-4 h-4" />
            <h3 className="font-display font-bold text-sm text-slate-900">
              Registro Obligatorio de Comprador
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensaje de Regla */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Protección de Vendedores y Compradores:
            </span>
            <p className="text-[11px] text-amber-950 leading-relaxed">
              Como visitante puedes explorar libremente el catálogo. Para {actionContextText}, la plataforma exige una cuenta verificada para evitar fraudes y spam.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carolina Miranda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                placeholder="carolina.miranda@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono Móvil (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+56 9 8812 4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{mode === 'register' ? 'Registrarme y Continuar' : 'Iniciar Sesión'}</span>
            </button>
          </form>

          {/* Botón rápido de demo: Continuar como Cliente */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleQuickDemoClient}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Continuar como Cliente Demo (Carolina Miranda)</span>
            </button>

            <div className="flex items-center justify-center text-xs text-slate-500">
              {mode === 'register' ? (
                <span>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-amber-600 font-semibold hover:underline cursor-pointer"
                  >
                    Inicia Sesión
                  </button>
                </span>
              ) : (
                <span>
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-amber-600 font-semibold hover:underline cursor-pointer"
                  >
                    Regístrate aquí
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
