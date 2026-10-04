/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Vista Portal del Vendedor y Concesionario (SaaS Dashboard & CRM de Leads)
 * Permite consultar: nombre, teléfono, correo, vehículo interesado, mensaje, fecha y estado del lead
 * Estados: Nuevo | Contactado | En negociación | Vendido | Descartado
 */

import React, { useState } from 'react';
import { Vehicle, Lead, LeadStatus } from '../../types/marketplace';
import {
  TrendingUp,
  Eye,
  MessageSquare,
  Car,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  Search,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
  FileQuestion,
  PhoneCall,
  User,
  X,
  Send,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';

interface SellerDashboardViewProps {
  vehicles: Vehicle[];
  leads: Lead[];
  onOpenPublish: () => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onToggleVehicleStatus: (vehicleId: string) => void;
}

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
  const [sellerNote, setSellerNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<Record<string, string[]>>({});

  // KPIs
  const totalViews = vehicles.reduce((acc, v) => acc + (v.viewsCount || 0), 0);
  const totalLeads = leads.length;
  const activeCount = vehicles.filter((v) => v.status === 'publicado').length;

  // Conteo de leads por estado
  const countByStatus: Record<LeadStatus, number> = {
    Nuevo: leads.filter((l) => l.status === 'Nuevo').length,
    Contactado: leads.filter((l) => l.status === 'Contactado').length,
    'En negociación': leads.filter((l) => l.status === 'En negociación').length,
    Vendido: leads.filter((l) => l.status === 'Vendido').length,
    Descartado: leads.filter((l) => l.status === 'Descartado').length,
  };

  const filteredInventory = vehicles.filter((v) => {
    if (!inventorySearch) return true;
    const q = inventorySearch.toLowerCase();
    return (
      v.title.toLowerCase().includes(q) ||
      v.plateSnippet.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q)
    );
  });

  const filteredLeads = leads.filter((lead) => {
    // Filtro por estado
    if (leadStatusFilter !== 'Todos' && lead.status !== leadStatusFilter) {
      return false;
    }
    // Búsqueda por texto (nombre, teléfono, correo, vehículo, mensaje)
    if (leadSearch) {
      const q = leadSearch.toLowerCase();
      const matchName = lead.buyerName.toLowerCase().includes(q);
      const matchPhone = lead.buyerPhone.toLowerCase().includes(q);
      const matchEmail = lead.buyerEmail.toLowerCase().includes(q);
      const matchVehicle = lead.vehicleTitle.toLowerCase().includes(q);
      const matchMsg = lead.message.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchVehicle && !matchMsg) {
        return false;
      }
    }
    return true;
  });

  const handleAddNote = (leadId: string) => {
    if (!sellerNote.trim()) return;
    setSavedNotes((prev) => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${sellerNote.trim()}`],
    }));
    setSellerNote('');
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'Nuevo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Nuevo
          </span>
        );
      case 'Contactado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Contactado
          </span>
        );
      case 'En negociación':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            En negociación
          </span>
        );
      case 'Vendido':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            Vendido
          </span>
        );
      case 'Descartado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Descartado
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const getContactTypeLabel = (type: Lead['type']) => {
    switch (type) {
      case 'mensaje':
        return { label: 'Mensaje Directo', icon: MessageSquare, color: 'text-slate-700 bg-slate-100' };
      case 'solicitud_informacion':
        return { label: 'Solicitud Info', icon: FileQuestion, color: 'text-indigo-700 bg-indigo-50 border border-indigo-100' };
      case 'solicitar_llamada':
        return { label: 'Solicitud Llamada', icon: PhoneCall, color: 'text-amber-700 bg-amber-50 border border-amber-100' };
      case 'whatsapp':
        return { label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-700 bg-emerald-50 border border-emerald-100' };
      case 'test_drive':
        return { label: 'Test Drive', icon: Calendar, color: 'text-sky-700 bg-sky-50 border border-sky-100' };
      case 'oferta':
        return { label: 'Oferta Comercial', icon: DollarSign, color: 'text-purple-700 bg-purple-50 border border-purple-100' };
      default:
        return { label: type, icon: MessageSquare, color: 'text-slate-700 bg-slate-100' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* CABECERA DASHBOARD */}
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
          <p className="text-xs text-slate-500 mt-1">
            Gestión de inventario de vehículos y sistema comercial de leads con trazabilidad completa
          </p>
        </div>

        <button
          onClick={onOpenPublish}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Nuevo Vehículo</span>
        </button>
      </div>

      {/* METRIC STRIP (4 KPIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Avisos Activos</span>
            <Car className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono tabular-nums">
            {activeCount} <span className="text-xs font-normal text-slate-500">unidades</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">100% de operatividad</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Vistas Totales</span>
            <Eye className="w-4 h-4 text-sky-600" />
          </div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono tabular-nums">
            {totalViews.toLocaleString('es-CL')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">+18.4% vs mes anterior</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Leads Recibidos</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono tabular-nums">
            {totalLeads} <span className="text-xs font-normal text-slate-500">prospectos</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {countByStatus.Nuevo} nuevos · {countByStatus['En negociación']} en negociación
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Tasa de Cierre</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-display font-bold text-2xl text-slate-900 font-mono tabular-nums">
            {totalLeads > 0 ? ((countByStatus.Vendido / totalLeads) * 100).toFixed(1) : 0}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">{countByStatus.Vendido} ventas concretadas</span>
        </div>

      </div>

      {/* PESTAÑAS DE NAVEGACIÓN DEL PANEL */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 -mb-[2px] flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span>Bandeja de Leads de Clientes</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
            {leads.length}
          </span>
          {countByStatus.Nuevo > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {countByStatus.Nuevo} nuevos
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-3 text-xs font-semibold transition-colors cursor-pointer border-b-2 -mb-[2px] ${
            activeTab === 'inventory'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inventario de Vehículos ({vehicles.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BANDEJA DE LEADS (REQUERIMIENTO CENTRAL DE CONTACTO)               */}
      {/* ========================================================================= */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros de Leads por Estado y Búsqueda */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Filtros rápidos por estado */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Estado:
                </span>
                
                <button
                  onClick={() => setLeadStatusFilter('Todos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    leadStatusFilter === 'Todos'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todos ({leads.length})
                </button>

                {(['Nuevo', 'Contactado', 'En negociación', 'Vendido', 'Descartado'] as LeadStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      leadStatusFilter === st
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{st}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      leadStatusFilter === st ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {countByStatus[st]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Buscador de prospectos */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por comprador, teléfono, correo o vehículo..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

            </div>
          </div>

          {/* TABLA PRINCIPAL DE LEADS (Muestra los 7 campos requeridos) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="p-3.5">1. Nombre Comprador</th>
                    <th className="p-3.5">2. Teléfono</th>
                    <th className="p-3.5">3. Correo Electrónico</th>
                    <th className="p-3.5">4. Vehículo Interesado</th>
                    <th className="p-3.5">5. Mensaje del Lead</th>
                    <th className="p-3.5">6. Fecha</th>
                    <th className="p-3.5">7. Estado del Lead</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-slate-400 text-sm">
                        No se encontraron leads con el filtro o término de búsqueda seleccionado.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const typeConfig = getContactTypeLabel(lead.type);
                      const TypeIcon = typeConfig.icon;
                      
                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          {/* 1. Nombre */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                                {lead.buyerName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-semibold text-slate-900 block group-hover:text-amber-600 transition-colors">
                                  {lead.buyerName}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded mt-0.5 ${typeConfig.color}`}>
                                  <TypeIcon className="w-3 h-3" />
                                  {typeConfig.label}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 2. Teléfono */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-slate-900 font-semibold">{lead.buyerPhone}</span>
                              <a
                                href={`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title="Abrir WhatsApp"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${lead.buyerPhone.replace(/[^0-9]/g, '')}`}
                                onClick={(e) => e.stopPropagation()}
                                title="Llamar"
                                className="p-1 text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>

                          {/* 3. Correo */}
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-600">{lead.buyerEmail}</span>
                              <a
                                href={`mailto:${lead.buyerEmail}?subject=Consulta AutoMarket Pro: ${encodeURIComponent(lead.vehicleTitle)}`}
                                onClick={(e) => e.stopPropagation()}
                                title="Enviar Correo"
                                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>

                          {/* 4. Vehículo Interesado */}
                          <td className="p-3.5">
                            <div>
                              <span className="font-semibold text-slate-900 block line-clamp-1 max-w-[200px]">
                                {lead.vehicleTitle}
                              </span>
                              <span className="font-mono text-[11px] text-amber-700 font-bold block">
                                ${lead.vehiclePriceUsd.toLocaleString('en-US')} USD
                              </span>
                            </div>
                          </td>

                          {/* 5. Mensaje */}
                          <td className="p-3.5 max-w-[240px]">
                            <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                              {lead.message}
                            </p>
                            {lead.offeredPriceUsd && (
                              <span className="inline-block mt-1 font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                Oferta: ${lead.offeredPriceUsd.toLocaleString('en-US')} USD
                              </span>
                            )}
                            {lead.preferredCallTime && (
                              <span className="inline-block mt-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                Horario: {lead.preferredCallTime}
                              </span>
                            )}
                            {lead.preferredDate && (
                              <span className="inline-block mt-1 text-[11px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                                Fecha sugerida: {lead.preferredDate}
                              </span>
                            )}
                          </td>

                          {/* 6. Fecha */}
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {lead.createdAt}
                            </span>
                          </td>

                          {/* 7. Estado del Lead */}
                          <td className="p-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(lead.status)}
                            </div>
                          </td>

                          {/* Acciones: Selector de Estado Rápido */}
                          <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none focus:border-amber-500 shadow-xs"
                            >
                              <option value="Nuevo">Nuevo</option>
                              <option value="Contactado">Contactado</option>
                              <option value="En negociación">En negociación</option>
                              <option value="Vendido">Vendido</option>
                              <option value="Descartado">Descartado</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INVENTARIO DE VEHÍCULOS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por modelo o patente..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <span className="text-xs text-slate-500">
              {filteredInventory.length} vehículos listados
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="p-3.5">Vehículo</th>
                    <th className="p-3.5">Patente</th>
                    <th className="p-3.5">Precio (USD)</th>
                    <th className="p-3.5">Plan</th>
                    <th className="p-3.5">Vistas / Leads</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredInventory.map((veh) => (
                    <tr key={veh.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={veh.images[0]}
                            alt={veh.title}
                            className="w-12 h-9 rounded object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">{veh.title}</span>
                            <span className="text-[11px] text-slate-400">
                              {veh.year} · {veh.mileageKm.toLocaleString('es-CL')} km
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono">{veh.plateSnippet}</td>
                      <td className="p-3.5 font-mono tabular-nums font-semibold text-slate-900">
                        ${veh.priceUsd.toLocaleString('en-US')}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          veh.plan === 'premium'
                            ? 'bg-amber-100 text-amber-800'
                            : veh.plan === 'destacado'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {veh.plan}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono tabular-nums text-xs">
                        {veh.viewsCount} / {veh.leadsCount}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          veh.status === 'publicado'
                            ? 'text-emerald-700 bg-emerald-50'
                            : veh.status === 'en_pausa'
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-slate-600 bg-slate-100'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {veh.status === 'publicado' ? 'Activo' : veh.status === 'en_pausa' ? 'En Pausa' : veh.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onToggleVehicleStatus(veh.id)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                          title={veh.status === 'publicado' ? 'Pausar publicación' : 'Reactivar'}
                        >
                          {veh.status === 'publicado' ? (
                            <PauseCircle className="w-4 h-4 text-amber-600" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DETALLE DE LEAD (CRM INDIVIDUAL)                                     */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Cabecera */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Expediente de Lead #{selectedLead.id}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 mt-0.5">
                  {selectedLead.buyerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
              
              {/* Bloque de Estado y Cambio */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Estado Actual
                  </span>
                  <div className="mt-1">
                    {getStatusBadge(selectedLead.status)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Modificar a:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      const newSt = e.target.value as LeadStatus;
                      onUpdateLeadStatus(selectedLead.id, newSt);
                      setSelectedLead({ ...selectedLead, status: newSt });
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 cursor-pointer focus:outline-none focus:border-amber-500 shadow-xs"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="En negociación">En negociación</option>
                    <option value="Vendido">Vendido</option>
                    <option value="Descartado">Descartado</option>
                  </select>
                </div>
              </div>

              {/* Información del Comprador */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">
                  Datos de Contacto del Comprador
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    <span className="text-slate-400 text-[11px] block">Teléfono / WhatsApp</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold text-slate-900 font-mono">{selectedLead.buyerPhone}</span>
                      <a
                        href={`https://wa.me/${selectedLead.buyerPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-700"
                      >
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    <span className="text-slate-400 text-[11px] block">Correo Electrónico</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold text-slate-900 truncate max-w-[150px]">{selectedLead.buyerEmail}</span>
                      <a
                        href={`mailto:${selectedLead.buyerEmail}`}
                        className="px-2 py-1 bg-slate-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-900"
                      >
                        <Mail className="w-3 h-3" /> Responder
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehículo Asociado */}
              <div className="space-y-2">
                <h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">
                  Vehículo de Interés
                </h4>
                <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 block text-sm">{selectedLead.vehicleTitle}</span>
                    <span className="text-slate-400 text-[11px]">ID: {selectedLead.vehicleId} · Recibido el: {selectedLead.createdAt}</span>
                  </div>
                  <span className="font-display font-bold text-amber-700 text-base font-mono">
                    ${selectedLead.vehiclePriceUsd.toLocaleString('en-US')} USD
                  </span>
                </div>
              </div>

              {/* Mensaje original del Comprador */}
              <div className="space-y-2">
                <h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">
                  Mensaje Inicial del Prospecto
                </h4>
                <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 text-slate-800 leading-relaxed text-xs">
                  "{selectedLead.message}"
                  {selectedLead.offeredPriceUsd && (
                    <div className="mt-3 pt-2 border-t border-amber-200 text-amber-900 font-semibold font-mono">
                      Oferta propuesta: ${selectedLead.offeredPriceUsd.toLocaleString('en-US')} USD al contado
                    </div>
                  )}
                  {selectedLead.preferredDate && (
                    <div className="mt-1 text-slate-600">
                      Fecha propuesta para visita: {selectedLead.preferredDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Bitácora de Notas Internas de Venta */}
              <div className="space-y-2">
                <h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">
                  Bitácora de Seguimiento Interno
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {(savedNotes[selectedLead.id] || [
                    '14:20 - Lead ingresado automáticamente vía formulario web verificado.',
                  ]).map((note, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-700 font-mono">
                      {note}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Agregar nota de llamada o negociación..."
                    value={sellerNote}
                    onChange={(e) => setSellerNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedLead.id)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => handleAddNote(selectedLead.id)}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Guardar Nota
                  </button>
                </div>
              </div>

            </div>

            {/* Pie de modal */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                AutoMarket Pro CRM · Registro inmutable
              </span>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
