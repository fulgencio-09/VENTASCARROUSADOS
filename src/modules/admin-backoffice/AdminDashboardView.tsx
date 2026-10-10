import React, { useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Filter, Search, ShieldCheck, XCircle } from 'lucide-react';
import { Lead, Vehicle } from '../../types/marketplace';
import { AdminDatabaseView } from './AdminDatabaseView';

interface AdminDashboardViewProps {
  vehicles: Vehicle[];
  leads?: Lead[];
  onApproveVehicle: (id: string) => void;
  onRejectVehicle: (id: string, reason: string) => void;
  onSuspendVehicle: (id: string) => void;
  onToggleFeatureVehicle: (id: string) => void;
  onSelectVehicle: (v: Vehicle) => void;
}
type AdminTab = 'gestion' | 'supervision';
const PAGE_SIZE = 10;

const Pagination: React.FC<{ page: number; total: number; onChange: (page: number) => void }> = ({ page, total, onChange }) => {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), pages);
  const start = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const end = Math.min(safePage * PAGE_SIZE, total);
  return (
    <div className="flex flex-col gap-3 border-t bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">Mostrando {start}–{end} de {total} registros</p>
      <div className="flex items-center gap-1">
        <button disabled={safePage === 1} onClick={() => onChange(safePage - 1)} className="rounded-lg border p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Página anterior"><ChevronLeft size={16}/></button>
        {Array.from({ length: pages }, (_, index) => index + 1).slice(Math.max(0, safePage - 3), Math.min(pages, safePage + 2)).map((number) => (
          <button key={number} onClick={() => onChange(number)} className={`min-w-9 rounded-lg px-3 py-2 text-xs font-semibold ${safePage === number ? 'bg-slate-900 text-white' : 'border text-slate-600 hover:bg-slate-50'}`}>{number}</button>
        ))}
        <button disabled={safePage === pages} onClick={() => onChange(safePage + 1)} className="rounded-lg border p-2 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Página siguiente"><ChevronRight size={16}/></button>
      </div>
    </div>
  );
};

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ vehicles, leads = [], onApproveVehicle, onRejectVehicle, onSelectVehicle }) => {
  const [tab, setTab] = useState<AdminTab>('supervision');
  const [leadFilter, setLeadFilter] = useState<'Todos' | Lead['status']>('Todos');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadPage, setLeadPage] = useState(1);
  const [publicationSearch, setPublicationSearch] = useState('');
  const [publicationPage, setPublicationPage] = useState(1);

  const pendingVehicles = useMemo(() => vehicles.filter((vehicle) => ['pendiente', 'pendiente_aprobacion'].includes(vehicle.status)), [vehicles]);
  const filteredPendingVehicles = useMemo(() => {
    const term = publicationSearch.trim().toLowerCase();
    if (!term) return pendingVehicles;
    return pendingVehicles.filter((vehicle) => [vehicle.title, vehicle.make, vehicle.model, vehicle.city].some((value) => String(value ?? '').toLowerCase().includes(term)));
  }, [pendingVehicles, publicationSearch]);
  const visiblePendingVehicles = useMemo(() => filteredPendingVehicles.slice((publicationPage - 1) * PAGE_SIZE, publicationPage * PAGE_SIZE), [filteredPendingVehicles, publicationPage]);

  const filteredLeads = useMemo(() => {
    const term = leadSearch.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusMatches = leadFilter === 'Todos' || lead.status === leadFilter;
      const searchMatches = !term || [lead.buyerName, lead.buyerEmail, lead.buyerPhone, lead.vehicleTitle, lead.message].some((value) => String(value ?? '').toLowerCase().includes(term));
      return statusMatches && searchMatches;
    });
  }, [leads, leadFilter, leadSearch]);
  const visibleLeads = useMemo(() => filteredLeads.slice((leadPage - 1) * PAGE_SIZE, leadPage * PAGE_SIZE), [filteredLeads, leadPage]);
  const formatCop = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  const changeLeadFilter = (status: 'Todos' | Lead['status']) => { setLeadFilter(status); setLeadPage(1); };
  const changeLeadSearch = (value: string) => { setLeadSearch(value); setLeadPage(1); };
  const changePublicationSearch = (value: string) => { setPublicationSearch(value); setPublicationPage(1); };

  return <div className="min-h-screen bg-slate-50"><div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
    <header className="flex flex-col gap-2 border-b border-slate-200 pb-5"><p className="text-xs font-semibold uppercase tracking-widest text-orange-600">BackOffice</p><h1 className="text-3xl font-bold text-slate-900">Supervisión de la operación</h1><p className="text-slate-500 max-w-3xl">Administración y supervisión del marketplace. Las ventas y negociaciones pertenecen exclusivamente al vendedor o concesionario propietario.</p></header>
    <div className="flex flex-wrap gap-2 rounded-2xl border bg-white p-2"><button onClick={() => setTab('supervision')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'supervision' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}><ShieldCheck className="inline mr-2" size={16}/>Supervisión comercial</button><button onClick={() => setTab('gestion')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab === 'gestion' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>Usuarios y roles</button></div>
    {tab === 'gestion' && <AdminDatabaseView />}
    {tab === 'supervision' && <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Publicaciones pendientes</p><p className="mt-2 text-3xl font-bold text-slate-900">{pendingVehicles.length}</p><p className="mt-1 text-xs text-slate-500">Requieren revisión administrativa</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wider text-slate-500">Leads supervisados</p><p className="mt-2 text-3xl font-bold text-slate-900">{leads.length}</p><p className="mt-1 text-xs text-slate-500">Solo consulta, sin modificar la negociación</p></div><div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="text-xs uppercase tracking-wider text-blue-700">Regla administrativa</p><p className="mt-2 text-sm font-semibold text-blue-900">Aprobar publicación no permite administrar la venta.</p></div></section>
      <section className="overflow-hidden rounded-2xl border bg-white"><div className="border-b p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="font-bold text-slate-900">Publicaciones para aprobación</h2><p className="text-xs text-slate-500 mt-1">El administrador valida la publicación, no la negociación.</p></div><div className="relative w-full md:w-80"><Search className="absolute left-3 top-2.5 text-slate-400" size={16}/><input value={publicationSearch} onChange={(e) => changePublicationSearch(e.target.value)} placeholder="Buscar vehículo, marca, modelo o ciudad" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"/></div></div></div>{filteredPendingVehicles.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No hay publicaciones pendientes que coincidan con el filtro.</div> : <div className="divide-y">{visiblePendingVehicles.map((vehicle) => <div key={vehicle.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><button onClick={() => onSelectVehicle(vehicle)} className="text-left"><div className="font-semibold text-slate-900">{vehicle.title}</div><div className="mt-1 text-xs text-slate-500">{vehicle.make} {vehicle.model} · {vehicle.year} · {vehicle.city}</div><div className="mt-1 text-sm font-semibold text-orange-600">{formatCop(vehicle.priceCop ?? 0)}</div></button><div className="flex flex-wrap gap-2"><button onClick={() => onSelectVehicle(vehicle)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Eye size={15}/>Ver</button><button onClick={() => onApproveVehicle(vehicle.id)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><CheckCircle2 size={15}/>Aprobar publicación</button><button onClick={() => onRejectVehicle(vehicle.id, 'No cumple las condiciones de publicación')} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><XCircle size={15}/>Rechazar</button></div></div>)}</div>}<Pagination page={publicationPage} total={filteredPendingVehicles.length} onChange={setPublicationPage}/></section>
      <section className="overflow-hidden rounded-2xl border bg-white"><div className="border-b p-5"><div className="flex flex-col gap-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="font-bold text-slate-900">Ventas y leads de vendedores/concesionarios</h2><p className="text-xs text-slate-500 mt-1">Vista de supervisión. Los controles de negociación están deshabilitados para administración.</p></div><div className="relative w-full md:w-80"><Search className="absolute left-3 top-2.5 text-slate-400" size={16}/><input value={leadSearch} onChange={(e) => changeLeadSearch(e.target.value)} placeholder="Buscar comprador, vehículo, correo o mensaje" className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"/></div></div><div className="flex items-center gap-2 overflow-x-auto"><Filter size={15} className="text-slate-400"/>{(['Todos','Nuevo','Contactado','En negociación','Vendido','Descartado'] as const).map((status) => <button key={status} onClick={() => changeLeadFilter(status)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${leadFilter === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{status}</button>)}</div></div></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-4">Comprador</th><th className="p-4">Vehículo</th><th className="p-4">Mensaje</th><th className="p-4">Fecha</th><th className="p-4">Estado</th><th className="p-4">Acciones administrativas</th></tr></thead><tbody>{visibleLeads.map((lead) => <tr key={lead.id} className="border-t align-top"><td className="p-4"><div className="font-semibold text-slate-900">{lead.buyerName}</div><div className="text-xs text-slate-500">{lead.buyerPhone}</div><div className="text-xs text-slate-500">{lead.buyerEmail}</div></td><td className="p-4 font-medium text-slate-700">{lead.vehicleTitle}</td><td className="p-4 max-w-xs text-slate-600">{lead.message}</td><td className="p-4 whitespace-nowrap text-slate-500">{lead.createdAt}</td><td className="p-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{lead.status}</span></td><td className="p-4"><span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500"><Eye size={14}/>Solo consulta</span></td></tr>)}{visibleLeads.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-sm text-slate-500">No hay leads para los filtros seleccionados.</td></tr>}</tbody></table></div>
        <Pagination page={leadPage} total={filteredLeads.length} onChange={setLeadPage}/>
      </section>
    </div>}
  </div></div>;
};
