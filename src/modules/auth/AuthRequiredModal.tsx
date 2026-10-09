/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Autenticación real contra Laravel Sanctum.
 * Los únicos registros públicos permitidos son vendedor particular y concesionario.
 */

import React, { useEffect, useState } from 'react';
import { X, Lock, ShieldCheck, Mail, UserCheck, UserPlus, Building2 } from 'lucide-react';
import { AuthStateManager, RegisterPayload } from '../../core/auth/auth.state';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  actionContextText?: string;
  initialMode?: 'login' | 'register';
}

const inputClass = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500';

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  actionContextText = 'continuar',
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [externalOpen, setExternalOpen] = useState(false);
  const [role, setRole] = useState<'vendedor_particular' | 'concesionario'>('vendedor_particular');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentType, setDocumentType] = useState('CC');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [legalName, setLegalName] = useState('');
  const [commercialName, setCommercialName] = useState('');
  const [nit, setNit] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ mode?: 'login' | 'register' }>;
      setMode(customEvent.detail?.mode ?? 'login');
      setError(null);
      setExternalOpen(true);
    };

    window.addEventListener('automarket:open-auth', handler);
    return () => window.removeEventListener('automarket:open-auth', handler);
  }, []);

  const effectiveOpen = isOpen || externalOpen;
  const closeModal = () => {
    setExternalOpen(false);
    onClose();
  };

  if (!effectiveOpen) return null;

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthStateManager.getInstance().login(email, password);
      onAuthenticated();
      closeModal();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const payload: RegisterPayload = {
      role,
      email,
      password,
      password_confirmation: passwordConfirmation,
      first_name: firstName,
      last_name: lastName,
      document_type: documentType || undefined,
      document_number: documentNumber || undefined,
      phone,
      whatsapp: whatsapp || undefined,
      address: address || undefined,
    };

    if (role === 'concesionario') {
      payload.legal_name = legalName;
      payload.commercial_name = commercialName;
      payload.nit = nit;
      payload.dealer_email = email;
      payload.dealer_phone = phone;
      payload.dealer_whatsapp = whatsapp || undefined;
      payload.website = website || undefined;
      payload.dealer_address = address || undefined;
    }

    try {
      await AuthStateManager.getInstance().register(payload);
      onAuthenticated();
      closeModal();
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No fue posible completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600">
            {mode === 'login' ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <h3 className="font-display font-bold text-sm text-slate-900">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h3>
          </div>
          <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button type="button" onClick={() => { setMode('login'); setError(null); }} className={`flex-1 py-2 rounded-md cursor-pointer ${mode === 'login' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Iniciar sesión</button>
            <button type="button" onClick={() => { setMode('register'); setError(null); }} className={`flex-1 py-2 rounded-md cursor-pointer ${mode === 'register' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Registrarme</button>
          </div>

          {mode === 'login' ? (
            <>
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-amber-600" />Acceso protegido</span>
                <p className="text-[11px] text-amber-950 leading-relaxed">Para {actionContextText} debes iniciar sesión. El sistema identifica automáticamente tu rol desde la base de datos.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Correo electrónico *</label><div className="relative"><Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500" /></div></div>
                <div><label className="block text-xs font-medium text-slate-700 mb-1">Contraseña *</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} /></div>
                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"><UserCheck className="w-4 h-4" />{loading ? 'Validando...' : 'Iniciar sesión'}</button>
              </form>
            </>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setRole('vendedor_particular')} className={`p-3 rounded-xl border text-left cursor-pointer ${role === 'vendedor_particular' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}`}><UserCheck className="w-5 h-5 text-amber-600 mb-1" /><span className="block text-xs font-bold text-slate-900">Vendedor Particular</span><span className="block text-[10px] text-slate-500 mt-1">Publica y administra tus vehículos.</span></button>
                <button type="button" onClick={() => setRole('concesionario')} className={`p-3 rounded-xl border text-left cursor-pointer ${role === 'concesionario' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}`}><Building2 className="w-5 h-5 text-amber-600 mb-1" /><span className="block text-xs font-bold text-slate-900">Concesionario</span><span className="block text-[10px] text-slate-500 mt-1">Registra tu empresa e inventario.</span></button>
              </div>

              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-slate-700 mb-1">Nombres *</label><input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} /></div><div><label className="block text-xs font-medium text-slate-700 mb-1">Apellidos *</label><input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} /></div></div>
              <div className="grid grid-cols-[110px_1fr] gap-3"><div><label className="block text-xs font-medium text-slate-700 mb-1">Documento</label><select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className={inputClass}><option value="CC">CC</option><option value="CE">CE</option><option value="NIT">NIT</option><option value="PASAPORTE">Pasaporte</option></select></div><div><label className="block text-xs font-medium text-slate-700 mb-1">Número</label><input value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className={inputClass} /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-slate-700 mb-1">Teléfono *</label><input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} /></div><div><label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp</label><input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} /></div></div>
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Correo electrónico *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-slate-700 mb-1">Contraseña *</label><input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} /></div><div><label className="block text-xs font-medium text-slate-700 mb-1">Confirmar *</label><input type="password" required minLength={8} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className={inputClass} /></div></div>

              {role === 'concesionario' && <div className="border-t border-slate-100 pt-4 space-y-3"><p className="text-xs font-bold text-slate-900">Datos del concesionario</p><div><label className="block text-xs font-medium text-slate-700 mb-1">Razón social *</label><input required value={legalName} onChange={(e) => setLegalName(e.target.value)} className={inputClass} /></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-medium text-slate-700 mb-1">Nombre comercial *</label><input required value={commercialName} onChange={(e) => setCommercialName(e.target.value)} className={inputClass} /></div><div><label className="block text-xs font-medium text-slate-700 mb-1">NIT *</label><input required value={nit} onChange={(e) => setNit(e.target.value)} className={inputClass} /></div></div><div><label className="block text-xs font-medium text-slate-700 mb-1">Sitio web</label><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className={inputClass} /></div></div>}
              <div><label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label><input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} /></div>

              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
              <p className="text-[11px] text-slate-500 leading-relaxed">El registro público solo permite <strong>Vendedor Particular</strong> y <strong>Concesionario</strong>. Los roles administrativos son asignados exclusivamente por el Superadministrador.</p>
              <button type="submit" disabled={loading} className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"><UserPlus className="w-4 h-4" />{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
