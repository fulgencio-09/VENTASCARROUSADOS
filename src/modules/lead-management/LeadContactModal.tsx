/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Captura de leads con valores monetarios exclusivamente en COP.
 */

import React, { useState } from 'react';
import { Vehicle, Lead, LeadContactType } from '../../types/marketplace';
import { AuthStateManager } from '../../core/auth/auth.state';
import { X, Send, Calendar, CheckCircle2, ShieldCheck, Phone, Mail, User, Clock, MessageSquare, DollarSign, FileQuestion, PhoneCall } from 'lucide-react';

interface LeadContactModalProps { vehicle: Vehicle | null; type: LeadContactType; onClose: () => void; onSubmitLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void; }
const formatCop = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

export const LeadContactModal: React.FC<LeadContactModalProps> = ({ vehicle, type, onClose, onSubmitLead }) => {
  if (!vehicle) return null;
  const currentUser = AuthStateManager.getInstance().getSession().user;
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+57 300 881 4321');
  const [preferredCallTime, setPreferredCallTime] = useState('14:00 - 18:00 hrs');
  const [preferredDate, setPreferredDate] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const defaultMessages: Record<LeadContactType, string> = {
    mensaje: `Hola ${vehicle.seller.name}, tengo una consulta sobre el ${vehicle.title}. ¿Podrías darme más detalles?`,
    solicitud_informacion: `Hola, solicito el informe técnico completo y detalles de documentación del ${vehicle.title}.`,
    solicitar_llamada: `Hola, solicito que me llamen al número indicado para resolver dudas sobre financiamiento y condiciones del ${vehicle.title}.`,
    whatsapp: `Contacto iniciado desde la plataforma por WhatsApp para el ${vehicle.title}.`,
    test_drive: `Hola, me interesa coordinar una prueba de manejo para probar el ${vehicle.title}.`,
    oferta: `Hola, tengo disponibilidad de pago al contado para el ${vehicle.title}. Mi propuesta es de: `,
  };
  const [message, setMessage] = useState(defaultMessages[type] || '');
  const [submitted, setSubmitted] = useState(false);
  const titlesByType: Record<LeadContactType, { title: string; desc: string; icon: any }> = {
    mensaje: { title: 'Enviar Mensaje al Vendedor', desc: 'Tu mensaje llegará directamente a la bandeja privada del vendedor', icon: MessageSquare },
    solicitud_informacion: { title: 'Solicitar Información del Vehículo', desc: 'Pide ficha técnica extendida, estado de gravámenes o historial', icon: FileQuestion },
    solicitar_llamada: { title: 'Solicitar Llamada Telefónica', desc: 'El vendedor se comunicará contigo en el horario que prefieras', icon: PhoneCall },
    whatsapp: { title: 'Iniciar Contacto por WhatsApp', desc: 'Se registrará tu lead y se abrirá una conversación directa', icon: MessageSquare },
    test_drive: { title: 'Agendar Prueba de Manejo', desc: 'Selecciona una fecha preferente para evaluar el auto en persona', icon: Calendar },
    oferta: { title: 'Hacer Oferta de Compra', desc: 'Propón un precio de compra en pesos colombianos', icon: DollarSign },
  };
  const currentConfig = titlesByType[type] || titlesByType.mensaje;
  const IconComponent = currentConfig.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    const vehiclePriceCop = vehicle.priceCop ?? 0;
    const offeredPriceCop = offeredPrice ? Number(offeredPrice) : undefined;
    onSubmitLead({ vehicleId: vehicle.id, vehicleTitle: vehicle.title, vehiclePriceCop, buyerName: name, buyerEmail: email, buyerPhone: phone, type, message, preferredCallTime: type === 'solicitar_llamada' ? preferredCallTime : undefined, preferredDate: preferredDate || undefined, offeredPriceCop });
    setSubmitted(true);
    if (type === 'whatsapp') {
      const waMsg = encodeURIComponent(`Hola ${vehicle.seller.name}, te contacto desde AutoMarket Pro por el vehículo ${vehicle.title} (${formatCop(vehiclePriceCop)}). Mi nombre es ${name}.`);
      window.open(`https://wa.me/${vehicle.seller.phone.replace(/[^0-9]/g, '')}?text=${waMsg}`, '_blank');
    }
    setTimeout(onClose, 2200);
  };

  return <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><IconComponent className="w-5 h-5" /></div><div><h3 className="font-display font-semibold text-base text-slate-900">{currentConfig.title}</h3><p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{vehicle.title}</p></div></div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"><X className="w-5 h-5" /></button>
      </div>
      {submitted ? <div className="p-8 text-center space-y-4"><div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-7 h-7" /></div><h4 className="font-display font-bold text-lg text-slate-900">¡Lead Registrado y Contacto Enviado!</h4><p className="text-xs text-slate-600 max-w-sm mx-auto">El vendedor <span className="font-semibold">{vehicle.seller.name}</span> ha recibido tu contacto.</p></div> :
      <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-950 flex items-center justify-between"><span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Cliente Verificado: {currentUser?.name || 'Cliente Registrado'}</span><span className="text-[11px] font-semibold text-emerald-700 uppercase font-mono">Lead Oficial</span></div>
        <div><label className="block text-xs font-medium text-slate-700 mb-1">Nombre Completo *</label><div className="relative"><User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900" /></div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico *</label><div className="relative"><Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900" /></div></div>
          <div><label className="block text-xs font-medium text-slate-700 mb-1">Teléfono Móvil (WhatsApp) *</label><div className="relative"><Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900" /></div></div>
        </div>
        {type === 'solicitar_llamada' && <div><label className="block text-xs font-medium text-slate-700 mb-1">Horario Preferido *</label><div className="relative"><Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><select value={preferredCallTime} onChange={(e) => setPreferredCallTime(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"><option>09:00 - 12:00 hrs</option><option>12:00 - 15:00 hrs</option><option>15:00 - 18:00 hrs</option><option>18:00 - 20:00 hrs</option></select></div></div>}
        {type === 'test_drive' && <div><label className="block text-xs font-medium text-slate-700 mb-1">Fecha Preferente *</label><div className="relative"><Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="date" required value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs" /></div></div>}
        {type === 'oferta' && <div><label className="block text-xs font-medium text-slate-700 mb-1">Monto Ofertado al Contado (COP) *</label><div className="relative"><DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="number" required min="0" placeholder={`Precio de lista: ${formatCop(vehiclePriceCop)}`} value={offeredPrice} onChange={(e) => setOfferedPrice(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900" /></div></div>}
        <div><label className="block text-xs font-medium text-slate-700 mb-1">Mensaje para el Vendedor</label><textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs resize-none" /></div>
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400"><span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Lead auditado con trazabilidad</span><button type="submit" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Confirmar y Enviar Lead</button></div>
      </form>}
    </div>
  </div>;
};
