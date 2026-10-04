/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * BackOffice Administrativo Completo — AutoMarket Pro
 * Módulos integrados (20):
 * Dashboard, Usuarios, Clientes, Vendedores, Concesionarios, Vehículos,
 * Publicaciones, Moderación, Planes, Pagos, Facturas, Leads, Mensajes,
 * Publicidad, Reportes, Configuración, Roles, Permisos, Auditoría, Logs.
 * Acciones administrativas: Aprobar, Rechazar, Suspender, Destacar.
 */

import React, { useState } from 'react';
import { Vehicle, Lead, UserRole } from '../../types/marketplace';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Car,
  FileCheck2,
  ShieldAlert,
  CreditCard,
  FileText,
  MessageSquare,
  Megaphone,
  BarChart3,
  Settings,
  Shield,
  Key,
  History,
  Terminal,
  CheckCircle,
  XCircle,
  PauseCircle,
  Sparkles,
  Eye,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Lock,
  DollarSign,
  TrendingUp,
  Clock,
  ChevronRight,
  X,
  Star,
  RefreshCw,
  Sliders,
  Check,
} from 'lucide-react';

export type AdminModuleTab =
  | 'dashboard'
  | 'usuarios'
  | 'clientes'
  | 'vendedores'
  | 'concesionarios'
  | 'vehiculos'
  | 'publicaciones'
  | 'moderacion'
  | 'planes'
  | 'pagos'
  | 'facturas'
  | 'leads'
  | 'mensajes'
  | 'publicidad'
  | 'reportes'
  | 'configuracion'
  | 'roles'
  | 'permisos'
  | 'auditoria'
  | 'logs';

interface AdminDashboardViewProps {
  vehicles: Vehicle[];
  leads?: Lead[];
  onApproveVehicle: (id: string) => void;
  onRejectVehicle: (id: string, reason: string) => void;
  onSuspendVehicle: (id: string) => void;
  onToggleFeatureVehicle: (id: string) => void;
  onSelectVehicle: (v: Vehicle) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  vehicles,
  leads = [],
  onApproveVehicle,
  onRejectVehicle,
  onSuspendVehicle,
  onToggleFeatureVehicle,
  onSelectVehicle,
}) => {
  const [activeTab, setActiveTab] = useState<AdminModuleTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalVehId, setRejectModalVehId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Fotografías con calidad insuficiente');
  const [publicationFilter, setPublicationFilter] = useState<'todas' | 'publicado' | 'pendiente_aprobacion' | 'en_pausa' | 'rechazado'>('todas');

  // Datos mock para los 20 módulos
  const mockUsers = [
    { id: 'usr-001', name: 'Valeria Cárdenas', email: 'valeria.admin@automarket.pro', role: 'administrador', status: 'Activo', kyc: 'Aprobado', joined: '2024-08-01', phone: '+56 9 9123 4567' },
    { id: 'usr-002', name: 'Esteban Morales', email: 'esteban.mod@automarket.pro', role: 'moderador', status: 'Activo', kyc: 'Aprobado', joined: '2025-01-20', phone: '+56 9 8234 5678' },
    { id: 'usr-003', name: 'AutoCenter Los Andes', email: 'contacto@autocenter.cl', role: 'concesionario', status: 'Activo', kyc: 'Aprobado', joined: '2024-03-15', phone: '+56 9 8452 1190' },
    { id: 'usr-004', name: 'Vanguard Motors SpA', email: 'ventas@vanguard.cl', role: 'concesionario', status: 'Activo', kyc: 'Aprobado', joined: '2024-05-12', phone: '+56 9 7120 4455' },
    { id: 'usr-005', name: 'Rodrigo Espinoza', email: 'rodrigo.espinoza@hotmail.com', role: 'vendedor_particular', status: 'Activo', kyc: 'Aprobado', joined: '2026-02-14', phone: '+56 9 7654 3210' },
    { id: 'usr-006', name: 'Carolina Miranda', email: 'carolina.miranda@gmail.com', role: 'cliente', status: 'Activo', kyc: 'Aprobado', joined: '2026-05-10', phone: '+56 9 8812 4321' },
    { id: 'usr-007', name: 'Gonzalo Vergara', email: 'gvergara@empresa.cl', role: 'cliente', status: 'Activo', kyc: 'Pendiente', joined: '2026-09-01', phone: '+56 9 9234 1100' },
    { id: 'usr-008', name: 'Inversiones Automotrices Sur', email: 'contacto@surautos.cl', role: 'vendedor_particular', status: 'Suspendido', kyc: 'Rechazado', joined: '2026-08-11', phone: '+56 9 6123 9988' },
  ];

  const mockPayments = [
    { id: 'PAY-8921', user: 'AutoCenter Los Andes', amountUsd: 149.00, plan: 'Concesionaria Pro', gateway: 'Stripe', status: 'Completado', date: '2026-10-03 16:40' },
    { id: 'PAY-8920', user: 'Rodrigo Espinoza', amountUsd: 29.00, plan: 'Aviso Destacado', gateway: 'WebPay Plus', status: 'Completado', date: '2026-10-03 14:15' },
    { id: 'PAY-8919', user: 'Vanguard Motors SpA', amountUsd: 149.00, plan: 'Concesionaria Pro', gateway: 'MercadoPago', status: 'Completado', date: '2026-10-02 11:20' },
    { id: 'PAY-8918', user: 'Marcela Ríos', amountUsd: 59.00, plan: 'Aviso Premium', gateway: 'Stripe', status: 'Reembolsado', date: '2026-10-01 09:30' },
  ];

  const mockInvoices = [
    { folio: 'FAC-2026-00412', client: 'AutoCenter Los Andes SpA', taxId: '76.452.190-8', totalUsd: 149.00, vatUsd: 28.31, date: '2026-10-03', status: 'Emitida SII' },
    { folio: 'FAC-2026-00411', client: 'Rodrigo Espinoza', taxId: '16.782.331-4', totalUsd: 29.00, vatUsd: 5.51, date: '2026-10-03', status: 'Emitida SII' },
    { folio: 'FAC-2026-00410', client: 'Vanguard Motors SpA', taxId: '77.102.890-K', totalUsd: 149.00, vatUsd: 28.31, date: '2026-10-02', status: 'Emitida SII' },
  ];

  const mockAds = [
    { id: 'ad-01', title: 'Banner Principal Santander Consumer', location: 'Home Hero Inferior', status: 'Activo', impressions: 48900, clicks: 1420, ctr: '2.9%' },
    { id: 'ad-02', title: 'Seguros BCI Automotriz', location: 'Ficha Detalle Vehículo', status: 'Activo', impressions: 32100, clicks: 890, ctr: '2.8%' },
    { id: 'ad-03', title: 'Tag y Peajes Prepago Autopistas', location: 'Catálogo Barra Lateral', status: 'Pausado', impressions: 14500, clicks: 210, ctr: '1.4%' },
  ];

  const mockAuditLogs = [
    { id: 101, action: 'listing.approved', user: 'Valeria Cárdenas (Admin)', target: 'BMW Serie 3 330i (veh-001)', time: '2026-10-03 14:10', ip: '190.161.42.10', severity: 'info' },
    { id: 102, action: 'listing.featured', user: 'Valeria Cárdenas (Admin)', target: 'Toyota RAV4 Hybrid (veh-002)', time: '2026-10-03 13:50', ip: '190.161.42.10', severity: 'info' },
    { id: 103, action: 'listing.suspended', user: 'Esteban Morales (Mod)', target: 'Aviso sospechoso kilometraje (veh-099)', time: '2026-10-02 18:20', ip: '186.105.99.14', severity: 'warning' },
    { id: 104, action: 'security.login_failed', user: 'IP 45.132.89.201', target: 'Intento de fuerza bruta endpoint /auth/login', time: '2026-10-02 11:05', ip: '45.132.89.201', severity: 'danger' },
  ];

  const mockSystemLogs = [
    { id: 'log-1', level: 'INFO', context: 'QueueWorker', message: 'Job [SendNewLeadNotification] processed in 142ms', time: '2026-10-03 18:20:11' },
    { id: 'log-2', level: 'INFO', context: 'CacheService', message: 'Catalog cache tag [vehicles_query] refreshed successfully', time: '2026-10-03 18:15:00' },
    { id: 'log-3', level: 'WARNING', context: 'SanctumAuth', message: 'Rate limit threshold hit (5/5) for IP 190.22.41.9', time: '2026-10-03 17:42:19' },
    { id: 'log-4', level: 'INFO', context: 'StorageS3', message: 'Image optimized and uploaded to S3: /vehicles/veh-007/thumb_main.webp', time: '2026-10-03 16:30:05' },
  ];

  const mockRoles = [
    { role: 'visitante', name: 'Visitante (Público)', usersCount: '15.4K/día', description: 'Acceso a catálogo, fichas y comparador sin contacto directo' },
    { role: 'cliente', name: 'Cliente Comprador', usersCount: 1840, description: 'Puede enviar mensajes, solicitar llamadas, WhatsApp y favoritos' },
    { role: 'vendedor_particular', name: 'Vendedor Particular', usersCount: 310, description: 'Publicación de hasta 2 vehículos con planes estándar' },
    { role: 'concesionario', name: 'Concesionario Oficial', usersCount: 42, description: 'Publicación ilimitada, multisede y leads corporativos' },
    { role: 'moderador', name: 'Moderador de Contenido', usersCount: 4, description: 'Aprobación y rechazo de publicaciones y validación KYC' },
    { role: 'administrador', name: 'Administrador General', usersCount: 2, description: 'Control de finanzas, planes, reportes y suspensión de cuentas' },
    { role: 'superadministrador', name: 'Superadministrador', usersCount: 1, description: 'Acceso irrestricto, configuración del core y roles/permisos' },
  ];

  const mockPermissions = [
    { module: 'Publicaciones', read: 'Todos', create: 'Vendedor, Concesionario', update: 'Propietario, Mod, Admin', delete: 'Admin, SuperAdmin', special: 'Aprobar, Suspender, Destacar (Admin/Mod)' },
    { module: 'Leads & Contactos', read: 'Propietario, Admin', create: 'Cliente registrado', update: 'Vendedor (estado)', delete: 'SuperAdmin', special: 'Ver datos privados (Teléfono, Email)' },
    { module: 'Pagos & Facturación', read: 'Admin, SuperAdmin, Cliente (propios)', create: 'Sistema / Pasarela', update: 'Admin', delete: 'Inmutable', special: 'Emisión DTE SII' },
    { module: 'Auditoría & Logs', read: 'SuperAdmin, Admin', create: 'Sistema automático', update: 'Bloqueado (Solo lectura)', delete: 'Bloqueado (Inmutable)', special: 'Forense IP & UserAgent' },
  ];

  // Filtros de Publicaciones
  const pendingVehicles = vehicles.filter((v) => v.status === 'pendiente_aprobacion');
  
  const filteredPublications = vehicles.filter((v) => {
    if (publicationFilter !== 'todas' && v.status !== publicationFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.plateSnippet.toLowerCase().includes(q) ||
        v.vinSnippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmReject = () => {
    if (rejectModalVehId) {
      onRejectVehicle(rejectModalVehId, rejectReason);
      setRejectModalVehId(null);
    }
  };

  // Navegación lateral clasificada por áreas
  const navigationSections = [
    {
      title: 'Operación & Moderación',
      items: [
        { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard },
        { id: 'moderacion', label: 'Cola de Moderación', icon: ShieldAlert, badge: pendingVehicles.length },
        { id: 'publicaciones', label: 'Publicaciones', icon: FileCheck2, badge: vehicles.length },
        { id: 'vehiculos', label: 'Inventario Vehículos', icon: Car },
      ],
    },
    {
      title: 'Usuarios & Entidades',
      items: [
        { id: 'usuarios', label: 'Todos los Usuarios', icon: Users, badge: mockUsers.length },
        { id: 'clientes', label: 'Clientes Compradores', icon: UserCheck },
        { id: 'vendedores', label: 'Vendedores Particulares', icon: Users },
        { id: 'concesionarios', label: 'Concesionarios Oficiales', icon: Building2 },
      ],
    },
    {
      title: 'Finanzas & Monetización',
      items: [
        { id: 'planes', label: 'Planes de Publicación', icon: Sliders },
        { id: 'pagos', label: 'Pagos & Transacciones', icon: CreditCard },
        { id: 'facturas', label: 'Facturas Electrónicas', icon: FileText },
        { id: 'publicidad', label: 'Publicidad & Banners', icon: Megaphone },
      ],
    },
    {
      title: 'CRM & Interacción',
      items: [
        { id: 'leads', label: 'Gestión de Leads', icon: MessageSquare, badge: leads.length },
        { id: 'mensajes', label: 'Mensajería & Consultas', icon: MessageSquare },
        { id: 'reportes', label: 'Reportes & Exportación', icon: BarChart3 },
      ],
    },
    {
      title: 'Seguridad & Gobierno',
      items: [
        { id: 'roles', label: 'Roles de Acceso', icon: Shield },
        { id: 'permisos', label: 'Matriz de Permisos', icon: Key },
        { id: 'auditoria', label: 'Auditoría Inmutable', icon: History },
        { id: 'logs', label: 'Logs del Sistema', icon: Terminal },
        { id: 'configuracion', label: 'Configuración Global', icon: Settings },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* CABECERA PRINCIPAL DEL BACKOFFICE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              BackOffice Administrativo & Control Maestro
            </h1>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
              <ShieldAlert className="w-3.5 h-3.5" /> SuperAdmin / Moderador RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión completa de los 20 módulos: inventario, finanzas, moderación, roles y trazabilidad
          </p>
        </div>

        {/* Acceso Rápido a Cola de Moderación */}
        {pendingVehicles.length > 0 && (
          <button
            onClick={() => setActiveTab('moderacion')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors self-start lg:self-auto"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Hay {pendingVehicles.length} aviso(s) pendiente(s) de moderar</span>
          </button>
        )}
      </div>

      {/* DISPOSICIÓN PRINCIPAL: NAVEGACIÓN LATERAL (20 MÓDULOS) + PANEL DE CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: MENÚ DE 20 MÓDULOS (3 COLS) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-3.5 space-y-5 shadow-xs sticky top-20">
          <div className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Módulos del Sistema
          </div>

          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {navigationSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminModuleTab);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: CONTENIDO DEL MÓDULO ACTIVO (9 COLS) */}
        <div className="lg:col-span-9 space-y-6">

          {/* ================================================================= */}
          {/* MÓDULO 1: DASHBOARD GENERAL                                      */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* KPIs Principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Vehículos</span>
                  <div className="text-2xl font-bold font-mono text-slate-900">{vehicles.length}</div>
                  <span className="text-[11px] text-emerald-600">{vehicles.filter(v => v.status === 'publicado').length} publicados activos</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pendientes Moderación</span>
                  <div className="text-2xl font-bold font-mono text-amber-600">{pendingVehicles.length}</div>
                  <span className="text-[11px] text-amber-700 font-medium">Revisión requerida</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ingresos Mensuales</span>
                  <div className="text-2xl font-bold font-mono text-slate-900">$14.850 USD</div>
                  <span className="text-[11px] text-emerald-600">+18% vs mes anterior</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-xs">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Leads Generados</span>
                  <div className="text-2xl font-bold font-mono text-slate-900">{leads.length}</div>
                  <span className="text-[11px] text-sky-600">Canal comprador verificado</span>
                </div>
              </div>

              {/* Acciones Rápidas de Administración */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-white">
                    Acciones de Moderación Inmediata
                  </h3>
                  <p className="text-xs text-slate-300">
                    Puedes aprobar, rechazar con motivo, suspender cautelarmente o destacar avisos con 1 clic.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('moderacion')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Ir a Moderación ({pendingVehicles.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('publicaciones')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs cursor-pointer border border-slate-700"
                  >
                    Ver Publicaciones
                  </button>
                </div>
              </div>

              {/* Resumen de Últimas Actividades de Auditoría */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-500" />
                    Últimas Acciones de Auditoría y Seguridad
                  </h3>
                  <button
                    onClick={() => setActiveTab('auditoria')}
                    className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
                  >
                    Ver todo el log
                  </button>
                </div>

                <div className="space-y-2">
                  {mockAuditLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-800">{log.action}</span>
                        <span className="text-slate-500 ml-2">por {log.user} sobre {log.target}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 2: MODERACIÓN (Aprobar, Rechazar, Suspender, Destacar)      */}
          {/* ================================================================= */}
          {activeTab === 'moderacion' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    Cola de Moderación de Publicaciones
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Avisos que requieren validación de fotos, VIN, documentación y precios antes de salir al catálogo
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  {pendingVehicles.length} pendientes
                </span>
              </div>

              {pendingVehicles.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="font-semibold text-slate-800 text-sm">¡Al día! No hay avisos pendientes de moderación.</p>
                  <p className="text-slate-400">Todas las publicaciones enviadas han sido aprobadas o resueltas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVehicles.map((veh) => (
                    <div
                      key={veh.id}
                      className="border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={veh.images[0]}
                          alt={veh.title}
                          className="w-24 h-18 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">{veh.make} · {veh.model}</span>
                            <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.2 rounded">VIN: {veh.vinSnippet}</span>
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm">{veh.title}</h3>
                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                            <span className="font-mono tabular-nums font-bold text-slate-900">${veh.priceUsd.toLocaleString('en-US')} USD</span>
                            <span>·</span>
                            <span>Vendedor: {veh.seller.name}</span>
                            <span>·</span>
                            <span>Inspección: {veh.inspectionScore}/100</span>
                          </div>
                        </div>
                      </div>

                      {/* 4 ACCIONES REQUERIDAS: APROBAR, RECHAZAR, SUSPENDER, DESTACAR */}
                      <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                        <button
                          onClick={() => onSelectVehicle(veh)}
                          className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Inspeccionar detalle y fotos"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" /> Ficha
                        </button>

                        <button
                          onClick={() => onToggleFeatureVehicle(veh.id)}
                          className={`px-3 py-2 border text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors ${
                            veh.isFeatured
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                          title="Destacar en Home y Catálogo"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Destacar
                        </button>

                        <button
                          onClick={() => setRejectModalVehId(veh.id)}
                          className="px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                          title="Rechazar con motivo"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Rechazar
                        </button>

                        <button
                          onClick={() => onApproveVehicle(veh.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                          title="Aprobar publicación"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Aprobar Aviso
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 3: PUBLICACIONES (Gestión del ciclo completo)              */}
          {/* ================================================================= */}
          {activeTab === 'publicaciones' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-amber-600" />
                    Gestión Integral de Publicaciones ({vehicles.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Aprobar, rechazar, suspender cautelarmente y destacar publicaciones activas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por auto, patente o VIN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Filtro por estado de publicación */}
              <div className="flex items-center gap-2 flex-wrap">
                {(['todas', 'publicado', 'pendiente_aprobacion', 'en_pausa', 'rechazado'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPublicationFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                      publicationFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'todas' ? 'Todas las publicaciones' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Tabla de Publicaciones con los 4 botones de acción */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Vehículo / Aviso</th>
                      <th className="p-3.5">Vendedor</th>
                      <th className="p-3.5">Precio</th>
                      <th className="p-3.5">Plan</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5">Destacado</th>
                      <th className="p-3.5 text-right">Acciones Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredPublications.map((veh) => (
                      <tr key={veh.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img src={veh.images[0]} alt={veh.title} className="w-12 h-9 rounded object-cover border border-slate-200 shrink-0" />
                            <div>
                              <span className="font-semibold text-slate-900 block">{veh.title}</span>
                              <span className="text-[11px] text-slate-400 font-mono">VIN: {veh.vinSnippet} · Placa: {veh.plateSnippet}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-800">{veh.seller.name}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">${veh.priceUsd.toLocaleString('en-US')}</td>
                        <td className="p-3.5 uppercase text-[11px] font-bold text-amber-700">{veh.plan}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            veh.status === 'publicado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            veh.status === 'pendiente_aprobacion' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            veh.status === 'en_pausa' ? 'bg-slate-100 text-slate-700' :
                            'bg-rose-50 text-rose-700'
                          }`}>
                            {veh.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {veh.isFeatured ? (
                            <span className="text-amber-600 flex items-center gap-1 font-bold text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Sí
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">No</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                          {/* 1. Aprobar */}
                          {veh.status !== 'publicado' && (
                            <button
                              onClick={() => onApproveVehicle(veh.id)}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded cursor-pointer"
                              title="Aprobar publicación"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* 2. Rechazar */}
                          <button
                            onClick={() => setRejectModalVehId(veh.id)}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded cursor-pointer"
                            title="Rechazar publicación"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>

                          {/* 3. Suspender */}
                          <button
                            onClick={() => onSuspendVehicle(veh.id)}
                            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded cursor-pointer"
                            title="Suspender cautelarmente aviso"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>

                          {/* 4. Destacar */}
                          <button
                            onClick={() => onToggleFeatureVehicle(veh.id)}
                            className={`p-1.5 rounded cursor-pointer ${
                              veh.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                            title={veh.isFeatured ? 'Quitar destacado' : 'Destacar publicación'}
                          >
                            <Sparkles className="w-4 h-4 text-amber-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 4: USUARIOS                                                */}
          {/* ================================================================= */}
          {activeTab === 'usuarios' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Directorio Maestro de Usuarios ({mockUsers.length})
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Nombre & Teléfono</th>
                      <th className="p-3.5">Correo</th>
                      <th className="p-3.5">Rol RBAC</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5">KYC</th>
                      <th className="p-3.5 text-right">Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{u.phone}</span>
                        </td>
                        <td className="p-3.5">{u.email}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-slate-100 text-slate-800">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${u.status === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5">{u.kyc}</td>
                        <td className="p-3.5 text-right font-mono text-slate-400">{u.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 5: CLIENTES                                                */}
          {/* ================================================================= */}
          {activeTab === 'clientes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-600" />
                Clientes Compradores Registrados
              </h2>
              <p className="text-xs text-slate-500">
                Usuarios con permiso para generar leads, guardar favoritos y contactar vendedores.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Cliente</th>
                      <th className="p-3.5">Correo</th>
                      <th className="p-3.5">Teléfono (WhatsApp)</th>
                      <th className="p-3.5">Leads Emitidos</th>
                      <th className="p-3.5 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockUsers.filter(u => u.role === 'cliente').map((c) => (
                      <tr key={c.id}>
                        <td className="p-3.5 font-semibold text-slate-900">{c.name}</td>
                        <td className="p-3.5">{c.email}</td>
                        <td className="p-3.5 font-mono">{c.phone}</td>
                        <td className="p-3.5 font-mono font-bold text-amber-700">3 consultas</td>
                        <td className="p-3.5 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">Verificado</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 6: VENDEDORES                                              */}
          {/* ================================================================= */}
          {activeTab === 'vendedores' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Vendedores Particulares
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Vendedor</th>
                      <th className="p-3.5">Contacto</th>
                      <th className="p-3.5">Avisos Activos</th>
                      <th className="p-3.5">Calificación</th>
                      <th className="p-3.5 text-right">Estado KYC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockUsers.filter(u => u.role === 'vendedor_particular').map((v) => (
                      <tr key={v.id}>
                        <td className="p-3.5 font-semibold text-slate-900">{v.name}</td>
                        <td className="p-3.5">{v.email} · {v.phone}</td>
                        <td className="p-3.5 font-mono font-bold">1 auto publicado</td>
                        <td className="p-3.5 text-amber-600 font-bold">★ 4.9</td>
                        <td className="p-3.5 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">{v.kyc}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 7: CONCESIONARIOS                                          */}
          {/* ================================================================= */}
          {activeTab === 'concesionarios' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                Concesionarios & Agencias Oficiales
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Concesionaria</th>
                      <th className="p-3.5">Razón Social / TaxId</th>
                      <th className="p-3.5">Stock Publicado</th>
                      <th className="p-3.5">Plan Corporativo</th>
                      <th className="p-3.5 text-right">Estado KYC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockUsers.filter(u => u.role === 'concesionario').map((dealer) => (
                      <tr key={dealer.id}>
                        <td className="p-3.5 font-semibold text-slate-900">{dealer.name}</td>
                        <td className="p-3.5 font-mono text-slate-600">RUT: 76.452.190-8</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">4 unidades activas</td>
                        <td className="p-3.5"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">Pro Dealer $149/mes</span></td>
                        <td className="p-3.5 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">Aprobado</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 8: VEHÍCULOS (Inventario Físico)                           */}
          {/* ================================================================= */}
          {activeTab === 'vehiculos' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-600" />
                Inventario Maestro de Vehículos ({vehicles.length})
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Vehículo</th>
                      <th className="p-3.5">VIN Snippet</th>
                      <th className="p-3.5">Patente</th>
                      <th className="p-3.5">Inspección</th>
                      <th className="p-3.5">Kilometraje</th>
                      <th className="p-3.5 text-right">Precio USD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {vehicles.map((v) => (
                      <tr key={v.id}>
                        <td className="p-3.5 font-semibold text-slate-900">{v.title}</td>
                        <td className="p-3.5 font-mono text-slate-500">{v.vinSnippet}</td>
                        <td className="p-3.5 font-mono text-slate-900">{v.plateSnippet}</td>
                        <td className="p-3.5"><span className="text-emerald-700 font-bold font-mono">{v.inspectionScore}/100</span></td>
                        <td className="p-3.5 font-mono">{v.mileageKm.toLocaleString('es-CL')} km</td>
                        <td className="p-3.5 text-right font-mono font-bold text-slate-900">${v.priceUsd.toLocaleString('en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 9: PLANES                                                  */}
          {/* ================================================================= */}
          {activeTab === 'planes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                Configuración de Planes de Publicación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl p-5 space-y-3">
                  <span className="text-xs uppercase font-bold text-slate-400">Plan Básico</span>
                  <div className="font-display font-bold text-2xl text-slate-900">Gratis</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>✓ 5 fotos en catálogo</li>
                    <li>✓ 30 días de vigencia</li>
                    <li>✓ Posición estándar</li>
                  </ul>
                </div>
                <div className="border border-amber-300 bg-amber-50/40 rounded-xl p-5 space-y-3">
                  <span className="text-xs uppercase font-bold text-amber-700">Plan Destacado</span>
                  <div className="font-display font-bold text-2xl text-slate-900">$29 USD</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>✓ 15 fotos + Video HD</li>
                    <li>✓ 45 días de vigencia</li>
                    <li>✓ Resaltado en catálogo</li>
                  </ul>
                </div>
                <div className="border border-slate-900 bg-slate-900 text-white rounded-xl p-5 space-y-3">
                  <span className="text-xs uppercase font-bold text-amber-400">Plan Premium Concesionaria</span>
                  <div className="font-display font-bold text-2xl text-white">$149 USD/mes</div>
                  <ul className="text-xs text-slate-300 space-y-1">
                    <li>✓ Publicaciones ilimitadas</li>
                    <li>✓ Inspección 150 puntos certificada</li>
                    <li>✓ Leads prioritarios WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 10: PAGOS                                                  */}
          {/* ================================================================= */}
          {activeTab === 'pagos' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Pagos & Transacciones de Pasarelas
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">ID Transacción</th>
                      <th className="p-3.5">Cliente / Concesionario</th>
                      <th className="p-3.5">Monto USD</th>
                      <th className="p-3.5">Pasarela</th>
                      <th className="p-3.5">Fecha</th>
                      <th className="p-3.5 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3.5 font-mono font-bold text-slate-900">{p.id}</td>
                        <td className="p-3.5">{p.user}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">${p.amountUsd.toFixed(2)}</td>
                        <td className="p-3.5">{p.gateway}</td>
                        <td className="p-3.5 font-mono text-slate-400">{p.date}</td>
                        <td className="p-3.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${p.status === 'Completado' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 11: FACTURAS                                               */}
          {/* ================================================================= */}
          {activeTab === 'facturas' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Facturación Electrónica (DTE)
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Folio DTE</th>
                      <th className="p-3.5">Razón Social</th>
                      <th className="p-3.5">RUT / Tax ID</th>
                      <th className="p-3.5">Neto + IVA</th>
                      <th className="p-3.5">Fecha</th>
                      <th className="p-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockInvoices.map((inv) => (
                      <tr key={inv.folio}>
                        <td className="p-3.5 font-mono font-bold text-slate-900">{inv.folio}</td>
                        <td className="p-3.5">{inv.client}</td>
                        <td className="p-3.5 font-mono">{inv.taxId}</td>
                        <td className="p-3.5 font-mono">${inv.totalUsd.toFixed(2)} USD (IVA: ${inv.vatUsd})</td>
                        <td className="p-3.5 font-mono text-slate-400">{inv.date}</td>
                        <td className="p-3.5 text-right">
                          <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer">
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 12: LEADS (Supervisión global)                             */}
          {/* ================================================================= */}
          {activeTab === 'leads' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                Supervisión Global de Leads ({leads.length})
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Comprador</th>
                      <th className="p-3.5">Vehículo</th>
                      <th className="p-3.5">Tipo Canal</th>
                      <th className="p-3.5">Fecha</th>
                      <th className="p-3.5 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {leads.map((l) => (
                      <tr key={l.id}>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-900 block">{l.buyerName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{l.buyerPhone} · {l.buyerEmail}</span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800">{l.vehicleTitle}</td>
                        <td className="p-3.5 uppercase text-[11px] font-bold text-amber-700">{l.type}</td>
                        <td className="p-3.5 font-mono text-slate-400">{l.createdAt}</td>
                        <td className="p-3.5 text-right font-semibold">{l.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 13: MENSAJES & MODERACIÓN DE CHAT                          */}
          {/* ================================================================= */}
          {activeTab === 'mensajes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                Moderación de Mensajes y Consultas Directas
              </h2>
              <p className="text-xs text-slate-500">
                Filtro automático de palabras clave prohibidas, detección de lenguaje ofensivo y prevención de estafas.
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Filtro de Contenido Antispam NLP</span>
                    <span className="text-xs text-slate-500">Detecta números camuflados antes del registro formal</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">Activo</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 14: PUBLICIDAD & BANNERS                                   */}
          {/* ================================================================= */}
          {activeTab === 'publicidad' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-600" />
                Gestión de Publicidad & Banners Promocionales
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Campaña / Banner</th>
                      <th className="p-3.5">Ubicación</th>
                      <th className="p-3.5">Impresiones</th>
                      <th className="p-3.5">Clics</th>
                      <th className="p-3.5">CTR</th>
                      <th className="p-3.5 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockAds.map((ad) => (
                      <tr key={ad.id}>
                        <td className="p-3.5 font-semibold text-slate-900">{ad.title}</td>
                        <td className="p-3.5">{ad.location}</td>
                        <td className="p-3.5 font-mono">{ad.impressions.toLocaleString()}</td>
                        <td className="p-3.5 font-mono">{ad.clicks.toLocaleString()}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-600">{ad.ctr}</td>
                        <td className="p-3.5 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold">{ad.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 15: REPORTES                                               */}
          {/* ================================================================= */}
          {activeTab === 'reportes' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                Reportes Gerenciales y Exportación
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Reporte de Facturación Mensual</h4>
                  <p className="text-xs text-slate-500">Desglose de planes, IVA y pasarelas de pago.</p>
                  <button className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Reporte de Tiempos de Venta</h4>
                  <p className="text-xs text-slate-500">Rotación de inventario por marca y carrocería.</p>
                  <button className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">Informe de Auditoría de Moderación</h4>
                  <p className="text-xs text-slate-500">Métricas de rechazo y tiempos de aprobación.</p>
                  <button className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 16: CONFIGURACIÓN GLOBAL                                   */}
          {/* ================================================================= */}
          {activeTab === 'configuracion' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                Configuración Global del Marketplace
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Moneda Principal</label>
                  <input type="text" readOnly value="USD (Dólares Americanos)" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Límite Máximo Fotos Plan Gratis</label>
                  <input type="text" readOnly value="5 fotografías" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Días de Expiración por Aviso</label>
                  <input type="text" readOnly value="30 días corridos" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Pasarela Activa en Producción</label>
                  <input type="text" readOnly value="Stripe Connect & WebPay Plus" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 17: ROLES RBAC                                             */}
          {/* ================================================================= */}
          {activeTab === 'roles' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Jerarquía de Roles del Sistema (RBAC)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {mockRoles.map((r) => (
                  <div key={r.role} className="border border-slate-200 rounded-xl p-4 space-y-1 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{r.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">{r.usersCount} usuarios</span>
                    </div>
                    <p className="text-slate-600 text-xs">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 18: PERMISOS (Matriz Granular)                             */}
          {/* ================================================================= */}
          {activeTab === 'permisos' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                Matriz Granular de Permisos por Dominio
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Módulo / Recurso</th>
                      <th className="p-3.5">Lectura</th>
                      <th className="p-3.5">Creación</th>
                      <th className="p-3.5">Edición</th>
                      <th className="p-3.5">Acciones Especiales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockPermissions.map((pm, idx) => (
                      <tr key={idx}>
                        <td className="p-3.5 font-bold text-slate-900">{pm.module}</td>
                        <td className="p-3.5">{pm.read}</td>
                        <td className="p-3.5">{pm.create}</td>
                        <td className="p-3.5">{pm.update}</td>
                        <td className="p-3.5 font-semibold text-amber-700">{pm.special}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 19: AUDITORÍA INMUTABLE                                    */}
          {/* ================================================================= */}
          {activeTab === 'auditoria' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                Registro Inmutable de Auditoría Forense
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                    <tr>
                      <th className="p-3.5">Acción</th>
                      <th className="p-3.5">Usuario Ejecutor</th>
                      <th className="p-3.5">Recurso Afectado</th>
                      <th className="p-3.5">IP</th>
                      <th className="p-3.5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {mockAuditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="p-3.5 font-mono font-bold text-slate-900">{log.action}</td>
                        <td className="p-3.5">{log.user}</td>
                        <td className="p-3.5 text-slate-600">{log.target}</td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-500">{log.ip}</td>
                        <td className="p-3.5 text-right font-mono text-slate-400">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* MÓDULO 20: LOGS DEL SISTEMA                                       */}
          {/* ================================================================= */}
          {activeTab === 'logs' && (
            <div className="bg-slate-950 text-white rounded-2xl p-6 space-y-4 shadow-xl font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="font-display font-bold text-sm text-amber-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Logs en Vivo de Laravel & Redis Workers
                </h2>
                <span className="text-[11px] text-slate-400">Stream activo: storage/logs/laravel.log</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mockSystemLogs.map((l) => (
                  <div key={l.id} className="p-2.5 bg-slate-900/80 rounded border border-slate-800 flex items-start justify-between gap-4">
                    <div>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold mr-2 ${l.level === 'INFO' ? 'bg-sky-900 text-sky-300' : 'bg-amber-900 text-amber-300'}`}>
                        {l.level}
                      </span>
                      <span className="text-slate-400 mr-2">[{l.context}]</span>
                      <span className="text-slate-100">{l.message}</span>
                    </div>
                    <span className="text-slate-500 shrink-0 text-[11px]">{l.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL DE RECHAZO DE PUBLICACIÓN CON MOTIVO */}
      {rejectModalVehId && (
        <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in duration-150">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Rechazar Publicación de Vehículo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Selecciona el motivo oficial que se notificará por correo electrónico al vendedor para que pueda corregir su aviso:
            </p>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs cursor-pointer focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="Fotografías con calidad insuficiente o con marcas de agua de terceros">Fotografías con calidad insuficiente o con marcas de agua</option>
              <option value="Precio inconsistente con valor de mercado">Precio inconsistente con valor de mercado</option>
              <option value="Patente o VIN con inconsistencia legal o encargo">Patente o VIN con inconsistencia legal</option>
              <option value="Descripción con lenguaje inapropiado o datos de contacto ocultos">Descripción con lenguaje inapropiado o spam</option>
              <option value="Publicación duplicada detectada en la base de datos">Publicación duplicada detectada</option>
            </select>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRejectModalVehId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
