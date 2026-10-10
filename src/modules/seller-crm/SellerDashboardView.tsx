/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AutoMarket Pro - Portal del vendedor y concesionario.
 */

import React, { useMemo, useState } from 'react';
import { Vehicle, Lead, LeadStatus } from '../../types/marketplace';
import { formatCop } from '../../core/finance/currency';
import {
  TrendingUp,
  Eye,
  MessageSquare,
  Car,
  Plus,
  Calendar,
  Clock,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Search,
  Phone,
  Mail,
  Filter,
  DollarSign,
  FileQuestion,
  PhoneCall,
  X,
  CheckCheck,
} from 'lucide-react';

interface SellerDashboardViewProps {
  vehicles: Vehicle[];
  leads: Lead[];
  onOpenPublish: () => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onToggleVehicleStatus: (vehicleId: string) => void;
}

const leadStatuses: LeadStatus[] = ['Nuevo', 'Contactado', 'En negociación', 'Vendido', 'Descartado'];

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  vehicles,
  leads,
  onOpenPublish,
  onUpdateLeadStatus,
  onToggleVehicleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads'>('leads');
  const [inventorySearch, setInventorySearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'Todos' | LeadStatus>('Todos');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const totalViews = vehicles.reduce((acc, vehicle) => acc + (vehicle.viewsCount || 0), 0);
  const totalLeads = leads.length;
  const activeCount = vehicles.filter((vehicle) => vehicle.status === 'publicado').length;

  const countByStatus = useMemo<Record<LeadStatus, number>>(
    () => ({
      Nuevo: leads.filter((lead) => lead.status === 'Nuevo').length,
      Contactado: leads.filter((lead) => lead.status === 'Contactado').length,
      'En negociación': leads.filter((lead) => lead.status === 'En negociación').length,
      Vendido: leads.filter((lead) => lead.status === 'Vendido').length,
      Descartado: leads.filter((lead) => lead.status === 'Descartado').length,
    }),
    [leads],
  );

  const filteredInventory = useMemo(() => {
    const q = inventorySearch.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((vehicle) =>
      [vehicle.title, vehicle.make, vehicle.plateSnippet].some((value) =>
        value.toLowerCase().includes(q),
      ),
    );
  }, [vehicles, inventorySearch]);

  const filteredLeads = useMemo(() => {
    const q = leadSearch.trim().toLowerCase();
    return leads.filter((lead) => {
      if (leadStatusFilter !== 'Todos' && lead.status !== leadStatusFilter) return false;
      if (!q) return true;
      return [
        lead.buyerName,
        lead.buyerPhone,
        lead.buyerEmail,
        lead.vehicleTitle,
        lead.message,
      ].some((value) => value.toLowerCase().includes(q));
    });
  }, [leads, leadSearch, leadStatusFilter]);

  const getStatusBadge = (status: LeadStatus) => {
    const styles: Record<LeadStatus, string> = {
      Nuevo: 'bg-rose-50 text-rose-700 border-rose-200',
      Contactado: 'bg-sky-50 text-sky-700 border-sky-200',
      'En negociación': 'bg-purple-50 text-purple-700 border-purple-200',
      Vendido: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      Descartado: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status === 'Vendido' ? <CheckCheck className="w-3.5 h-3.5" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
        {status}
      </span>
    );
  };

  const getContactTypeLabel = (type: Lead['type']) => {
    switch (type) {
      case 'mensaje': return { label: 'Mensaje Directo', icon: MessageSquare, color: 'text-slate-700 bg-slate-100' };
      case 'solicitud_informacion': return { label: 'Solicitud Info', icon: FileQuestion, color: 'text-indigo-700 bg-indigo-50' };
      case 'solicitar_llamada': return { label: 'Solicitud Llamada', icon: PhoneCall, color: 'text-amber-700 bg-amber-50' };
      case 'whatsapp': return { label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-700 bg-emerald-50' };
      case 'test_drive': return { label: 'Test Drive', icon: Calendar, color: 'text-sky-700 bg-sky-50' };
      case 'oferta': return { label: 'Oferta Comercial', icon: DollarSign, color: 'text-purple-700 bg-purple-50' };
      default: return { label: type, icon: MessageSquare, color: 'text-slate-700 bg-slate-100' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Panel de Concesionaria & Vendedor
            </h1>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verificado KYC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Gestión de inventario y sistema comercial de leads</p>
        </div>
        <button onClick={onOpenPublish} className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer">
          <Plus className="w-4 h-4" /> Publicar Nuevo Vehículo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500"><span className="text-xs font-medium uppercase tracking-wider">Avisos Activos</span><Car className="w-4 h-4 text-amber-600" /></div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono">{activeCount} <span className="text-xs font-normal text-slate-500">unidades</span></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500"><span className="text-xs font-medium uppercase tracking-wider">Vistas Totales</span><Eye className="w-4 h-4 text-sky-600" /></div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono">{totalViews.toLocaleString('es-CO')}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500"><span className="text-xs font-medium uppercase tracking-wider">Leads Recibidos</span><MessageSquare className="w-4 h-4 text-emerald-600" /></div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono">{totalLeads}</div>
          <span className="text-[11px] text-slate-500">{countByStatus.Nuevo} nuevos · {countByStatus['En negociación']} en negociación</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500"><span className="text-xs font-medium uppercase tracking-wider">Tasa de Cierre</span><TrendingUp className="w-4 h-4 text-purple-600" /></div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono">{totalLeads > 0 ? ((countByStatus.Vendido / totalLeads) * 100).toFixed(1) : 0}%</div>
          <span className="text-[11px] text-emerald-600 font-medium">{countByStatus.Vendido} ventas concretadas</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200">
        <button onClick={() => setActiveTab('leads')} className={`pb-3 px-3 text-xs font-semibold border-b-2 -mb-[2px] flex items-center gap-2 ${activeTab === 'leads' ? 'border-amber-600 text-slate-900' : 'border-transparent text-slate-500'}`}>
          <MessageSquare className="w-4 h-4 text-amber-600" /> Bandeja de Leads de Clientes
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{leads.length}</span>
        </button>
        <button onClick={() => setActiveTab('inventory')} className={`pb-3 px-3 text-xs font-semibold border-b-2 -mb-[2px] ${activeTab === 'inventory' ? 'border-amber-600 text-slate-900' : 'border-transparent text-slate-500'}`}>
          Inventario de Vehículos ({vehicles.length})
        </button>
      </div>

      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Estado:</span>
                <button onClick={() => setLeadStatusFilter('Todos')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${leadStatusFilter === 'Todos' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Todos ({leads.length})</button>
                {leadStatuses.map((status) => (
                  <button key={status} onClick={() => setLeadStatusFilter(status)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${leadStatusFilter === status ? 'bg-amber-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                    {status} ({countByStatus[status]})
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Buscar por comprador, teléfono, correo o vehículo..." value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                  <tr><th className="p-3.5">1. Nombre Comprador</th><th className="p-3.5">2. Teléfono</th><th className="p-3.5">3. Correo</th><th className="p-3.5">4. Vehículo Interesado</th><th className="p-3.5">5. Mensaje</th><th className="p-3.5">6. Fecha</th><th className="p-3.5">7. Estado</th><th className="p-3.5 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={8} className="p-10 text-center text-slate-400">No se encontraron leads.</td></tr>
                  ) : filteredLeads.map((lead) => {
                    const typeConfig = getContactTypeLabel(lead.type);
                    const TypeIcon = typeConfig.icon;
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                        <td className="p-3.5"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">{lead.buyerName.charAt(0)}</div><div><span className="font-semibold text-slate-900 block">{lead.buyerName}</span><span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded mt-0.5 ${typeConfig.color}`}><TypeIcon className="w-3 h-3" />{typeConfig.label}</span></div></div></td>
                        <td className="p-3.5"><div className="flex items-center gap-1.5"><span className="font-mono text-slate-900 font-semibold">{lead.buyerPhone}</span><a href={`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1 text-emerald-600 rounded"><MessageSquare className="w-3.5 h-3.5" /></a><a href={`tel:${lead.buyerPhone.replace(/[^0-9]/g, '')}`} onClick={(e) => e.stopPropagation()} className="p-1 text-amber-600 rounded"><Phone className="w-3.5 h-3.5" /></a></div></td>
                        <td className="p-3.5"><div className="flex items-center gap-1.5"><span className="text-slate-600">{lead.buyerEmail}</span><a href={`mailto:${lead.buyerEmail}`} onClick={(e) => e.stopPropagation()} className="p-1 text-slate-400 rounded"><Mail className="w-3.5 h-3.5" /></a></div></td>
                        <td className="p-3.5"><span className="font-semibold text-slate-900 block line-clamp-1 max-w-[200px]">{lead.vehicleTitle}</span><span className="font-mono text-[11px] text-amber-700 font-bold block">{formatCop(lead.vehiclePriceCop ?? 0)}</span></td>
                        <td className="p-3.5 max-w-[240px]"><p className="text-slate-600 line-clamp-2 text-xs">{lead.message}</p>{lead.offeredPriceCop != null && lead.offeredPriceCop > 0 && <span className="inline-block mt-1 font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Oferta: {formatCop(lead.offeredPriceCop)}</span>}{lead.preferredCallTime && <span className="inline-block mt-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Horario: {lead.preferredCallTime}</span>}</td>
                        <td className="p-3.5 whitespace-nowrap"><span className="text-slate-500 font-mono text-[11px] flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" />{lead.createdAt}</span></td>
                        <td className="p-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>{getStatusBadge(lead.status)}</td>
                        <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}><select value={lead.status} onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)} className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none focus:border-amber-500"><option value="Nuevo">Nuevo</option><option value="Contactado">Contactado</option><option value="En negociación">En negociación</option><option value="Vendido">Vendido</option><option value="Descartado">Descartado</option></select></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Buscar por modelo o placa..." value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs" /></div>
            <span className="text-xs text-slate-500">{filteredInventory.length} vehículos listados</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"><div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse min-w-[700px]"><thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold"><tr><th className="p-3.5">Vehículo</th><th className="p-3.5">Placa</th><th className="p-3.5">Precio (COP)</th><th className="p-3.5">Plan</th><th className="p-3.5">Vistas / Leads</th><th className="p-3.5">Estado</th><th className="p-3.5 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-slate-100 font-medium text-slate-700">{filteredInventory.map((vehicle) => <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors"><td className="p-3.5"><div className="flex items-center gap-3"><img src={vehicle.images[0] || ''} alt={vehicle.title} className="w-12 h-9 rounded object-cover border border-slate-200 shrink-0" /><div><span className="font-semibold text-slate-900 block">{vehicle.title}</span><span className="text-[11px] text-slate-400">{vehicle.year} · {vehicle.mileageKm.toLocaleString('es-CO')} km</span></div></div></td><td className="p-3.5 font-mono">{vehicle.plateSnippet}</td><td className="p-3.5 font-mono tabular-nums font-semibold text-slate-900">{formatCop(vehicle.priceCop ?? 0)}</td><td className="p-3.5"><span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-slate-100 text-slate-600">{vehicle.plan}</span></td><td className="p-3.5 font-mono tabular-nums text-xs">{vehicle.viewsCount} / {vehicle.leadsCount}</td><td className="p-3.5"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600 bg-slate-100"><span className="w-1.5 h-1.5 rounded-full bg-current" />{vehicle.status === 'publicado' ? 'Activo' : vehicle.status}</span></td><td className="p-3.5 text-right"><button onClick={() => onToggleVehicleStatus(vehicle.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer" title={vehicle.status === 'publicado' ? 'Pausar publicación' : 'Reactivar'}>{vehicle.status === 'publicado' ? <PauseCircle className="w-4 h-4 text-amber-600" /> : <PlayCircle className="w-4 h-4 text-emerald-600" />}</button></td></tr>)}</tbody></table></div></div>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between"><div><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Expediente de Lead #{selectedLead.id}</span><h3 className="font-display font-bold text-lg text-slate-900 mt-0.5">{selectedLead.buyerName}</h3></div><button onClick={() => setSelectedLead(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button></div>
            <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Estado Actual</span><div className="mt-1">{getStatusBadge(selectedLead.status)}</div></div><div className="flex items-center gap-2"><span className="text-xs text-slate-500 font-medium">Modificar a:</span><select value={selectedLead.status} onChange={(e) => { const newStatus = e.target.value as LeadStatus; onUpdateLeadStatus(selectedLead.id, newStatus); setSelectedLead({ ...selectedLead, status: newStatus }); }} className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 cursor-pointer"><option value="Nuevo">Nuevo</option><option value="Contactado">Contactado</option><option value="En negociación">En negociación</option><option value="Vendido">Vendido</option><option value="Descartado">Descartado</option></select></div></div>
              <div className="space-y-3"><h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">Datos de Contacto del Comprador</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="bg-white border border-slate-200 rounded-lg p-3"><span className="text-slate-400 text-[11px] block">Teléfono / WhatsApp</span><div className="flex items-center justify-between mt-1"><span className="font-semibold text-slate-900 font-mono">{selectedLead.buyerPhone}</span><a href={`https://wa.me/${selectedLead.buyerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold">WhatsApp</a></div></div><div className="bg-white border border-slate-200 rounded-lg p-3"><span className="text-slate-400 text-[11px] block">Correo Electrónico</span><div className="flex items-center justify-between mt-1"><span className="font-semibold text-slate-900 truncate max-w-[150px]">{selectedLead.buyerEmail}</span><a href={`mailto:${selectedLead.buyerEmail}`} className="px-2 py-1 bg-slate-800 text-white rounded text-[11px] font-semibold">Responder</a></div></div></div></div>
              <div className="space-y-2"><h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">Vehículo de Interés</h4><div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between"><div><span className="font-semibold text-slate-900 block text-sm">{selectedLead.vehicleTitle}</span><span className="text-slate-400 text-[11px]">ID: {selectedLead.vehicleId} · Recibido el: {selectedLead.createdAt}</span></div><span className="font-display font-bold text-amber-700 text-base font-mono">{formatCop(selectedLead.vehiclePriceCop ?? 0)}</span></div></div>
              <div className="space-y-2"><h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">Mensaje Inicial del Prospecto</h4><div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 text-slate-800 leading-relaxed text-xs">"{selectedLead.message}"{selectedLead.offeredPriceCop != null && selectedLead.offeredPriceCop > 0 && <div className="mt-3 pt-2 border-t border-amber-200 text-amber-900 font-semibold font-mono">Oferta propuesta: {formatCop(selectedLead.offeredPriceCop)} al contado</div>}{selectedLead.preferredDate && <div className="mt-1 text-slate-600">Fecha propuesta para visita: {selectedLead.preferredDate}</div>}</div></div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end"><button onClick={() => setSelectedLead(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer">Cerrar</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
