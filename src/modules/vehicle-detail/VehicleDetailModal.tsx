/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Vista Ficha Técnica Detallada (PDP): Galería sin deformación, Videos, Historial, Documentación, Inspección 150 pts y Financiamiento
 */

import React, { useState } from 'react';
import { Vehicle, LeadContactType } from '../../types/marketplace';
import { AuthStateManager } from '../../core/auth/auth.state';
import {
  X,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Phone,
  Calculator,
  Share2,
  FileCheck2,
  Users,
  Video,
  FileText,
  History,
  Maximize2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Heart,
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenLeadModal: (vehicle: Vehicle, type: LeadContactType) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (vehicle: Vehicle) => void;
  onRequireAuth?: (actionContext: string, pendingCallback: () => void) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onOpenLeadModal,
  isFavorite = false,
  onToggleFavorite,
  onRequireAuth,
}) => {
  if (!vehicle) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(48);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'history' | 'documentation' | 'video'>('specs');

  // Cálculo de Crédito Automotriz
  const downPaymentAmount = (vehicle.priceUsd * downPaymentPercent) / 100;
  const loanPrincipal = vehicle.priceUsd - downPaymentAmount;
  const annualInterestRate = 0.089; // 8.9% anual
  const monthlyRate = annualInterestRate / 12;
  const monthlyPayment = Math.round(
    (loanPrincipal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTermMonths))
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleContactAction = (type: LeadContactType) => {
    const session = AuthStateManager.getInstance().getSession();
    if (!session.isAuthenticated || session.user?.role === 'visitante') {
      if (onRequireAuth) {
        onRequireAuth('contactar al vendedor', () => {
          onOpenLeadModal(vehicle, type);
        });
        return;
      }
    }
    onOpenLeadModal(vehicle, type);
  };

  const handleFavoriteAction = () => {
    const session = AuthStateManager.getInstance().getSession();
    if (!session.isAuthenticated || session.user?.role === 'visitante') {
      if (onRequireAuth) {
        onRequireAuth('guardar este vehículo en tus favoritos', () => {
          if (onToggleFavorite) onToggleFavorite(vehicle);
        });
        return;
      }
    }
    if (onToggleFavorite) onToggleFavorite(vehicle);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* CABECERA MODAL SUPERIOR */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {vehicle.make} · {vehicle.model}
            </span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-mono">VIN: {vehicle.vinSnippet}</span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-mono">Placa: {vehicle.plateSnippet}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Favorito */}
            <button
              onClick={handleFavoriteAction}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'En Favoritos' : 'Guardar Favorito'}</span>
            </button>

            {/* Compartir */}
            <button
              onClick={handleShare}
              className="p-1.5 sm:px-3 sm:py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title="Copiar enlace"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL SCROLLEABLE */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-8 flex-1">
          
          {/* SECCIÓN 1: GALERÍA DE ALTA FIDELIDAD SIN DEFORMACIÓN Y MÓDULO DE COMPRA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* IZQUIERDA: GALERÍA (7 COLS) */}
            <div className="lg:col-span-7 space-y-3">
              
              {/* Contenedor Principal de Imagen: Mantiene la relación de aspecto sin recortar ni deformar */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group">
                <img
                  src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                  alt={`${vehicle.title} - Foto ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain transition-all duration-200"
                  referrerPolicy="no-referrer"
                />

                {/* Badge de Inspección */}
                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Inspección Certificada: {vehicle.inspectionScore}/100</span>
                </div>

                {/* Botón de Zoom a pantalla completa */}
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                  title="Ampliar fotografía"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Flechas de Navegación Rápida */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Foto siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[11px] font-mono">
                  {activeImageIndex + 1} / {vehicle.images.length}
                </div>
              </div>

              {/* Carrusel de Miniaturas con indicador de activo */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5">
                {vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-slate-900 ${
                      activeImageIndex === idx
                        ? 'border-amber-500 scale-102 shadow-xs'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* DERECHA: MÓDULO DE COMPRA Y CONTACTO (5 COLS) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200/90 rounded-xl p-5 space-y-5">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {vehicle.year} · {vehicle.bodyType}
                </span>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 leading-tight mt-0.5">
                  {vehicle.title}
                </h2>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span>{vehicle.city}, {vehicle.region}</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{vehicle.mileageKm.toLocaleString('es-CL')} km</span>
                  <span>·</span>
                  <span>Color: {vehicle.color}</span>
                </div>
              </div>

              {/* Precio y Cuota Financiera */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-xs text-slate-400 block">Precio al contado</span>
                <div className="font-display font-bold text-3xl text-slate-900 font-mono tabular-nums">
                  ${vehicle.priceUsd.toLocaleString('en-US')}{' '}
                  <span className="text-sm font-normal text-slate-500">USD</span>
                </div>
                <div className="text-xs font-semibold text-amber-700 mt-1 flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Desde ${monthlyPayment} USD/mes con crédito automotriz</span>
                </div>
              </div>

              {/* Perfil del Vendedor */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    {vehicle.seller.name}
                  </span>
                  {vehicle.seller.isVerified && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Verificado KYC
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>★ {vehicle.seller.rating} ({vehicle.seller.totalReviews} opiniones)</span>
                  <span>·</span>
                  <span>{vehicle.seller.city}</span>
                </div>
              </div>

              {/* Botones de Acción de Contacto (Generan Lead con Trazabilidad) */}
              <div className="space-y-2.5 pt-1">
                <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Canal Seguro:</strong> Cada consulta genera un Lead registrado en la bandeja del vendedor. Si eres visitante, se requerirá tu registro previo.
                  </span>
                </div>

                {/* 1. Contactar por WhatsApp */}
                <button
                  onClick={() => handleContactAction('whatsapp')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </button>

                {/* 2 & 3. Enviar Mensaje y Solicitar Llamada */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleContactAction('mensaje')}
                    className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enviar Mensaje</span>
                  </button>

                  <button
                    onClick={() => handleContactAction('solicitar_llamada')}
                    className="py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Solicitar Llamada</span>
                  </button>
                </div>

                {/* 4 & 5. Solicitar Información y Test Drive */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleContactAction('solicitud_informacion')}
                    className="py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Solicitar Info</span>
                  </button>

                  <button
                    onClick={() => handleContactAction('test_drive')}
                    className="py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Agendar Test Drive</span>
                  </button>
                </div>

                {/* 5. Guardar Favorito (Regla del Prompt: sólo cliente registrado) */}
                <button
                  onClick={handleFavoriteAction}
                  className={`w-full py-2 border rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  <span>{isFavorite ? 'Guardado en Mis Favoritos' : 'Guardar en Favoritos'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* SECCIÓN 2: ESPECIFICACIONES TÉCNICAS REQUERIDAS (TODOS LOS ATRIBUTOS) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-4">
            <h3 className="font-display font-semibold text-sm text-slate-900 uppercase tracking-wider">
              Ficha Técnica y Dimensiones del Vehículo
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Marca & Modelo</span>
                <span className="font-semibold text-slate-800">{vehicle.make} {vehicle.model}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Versión</span>
                <span className="font-semibold text-slate-800">{vehicle.version}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Año Fabricación</span>
                <span className="font-semibold text-slate-800 font-mono tabular-nums">{vehicle.year}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Kilometraje Real</span>
                <span className="font-semibold text-slate-800 font-mono tabular-nums">{vehicle.mileageKm.toLocaleString('es-CL')} km</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Motor</span>
                <span className="font-semibold text-slate-800">{vehicle.engine}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Potencia Máxima</span>
                <span className="font-semibold text-slate-800">{vehicle.horsepower} CV / HP</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Combustible</span>
                <span className="font-semibold text-slate-800">{vehicle.fuelType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Transmisión</span>
                <span className="font-semibold text-slate-800">{vehicle.transmission}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Carrocería</span>
                <span className="font-semibold text-slate-800">{vehicle.bodyType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Tracción</span>
                <span className="font-semibold text-slate-800">{vehicle.traction}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Puertas / Pasajeros</span>
                <span className="font-semibold text-slate-800">{vehicle.doors} puertas · {vehicle.passengers} pasajeros</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] uppercase">Color Exterior</span>
                <span className="font-semibold text-slate-800">{vehicle.color}</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: PESTAÑAS DE CONTENIDO TÉCNICO (SPECS, HISTORIAL, DOCUMENTACIÓN, VIDEO) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 -mb-[2px] transition-colors ${
                  activeTab === 'specs' ? 'border-amber-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Equipamiento ({vehicle.features.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 -mb-[2px] transition-colors flex items-center gap-1 ${
                  activeTab === 'history' ? 'border-amber-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Historial de Mantenciones
              </button>
              <button
                onClick={() => setActiveTab('documentation')}
                className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 -mb-[2px] transition-colors flex items-center gap-1 ${
                  activeTab === 'documentation' ? 'border-amber-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Documentación Legal
              </button>
              {vehicle.videos && vehicle.videos.length > 0 && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 -mb-[2px] transition-colors flex items-center gap-1 ${
                    activeTab === 'video' ? 'border-amber-600 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  Video Tour
                </button>
              )}
            </div>

            {/* TAB: EQUIPAMIENTO */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  {vehicle.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                    Descripción del Propietario
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-200/80">
                    {vehicle.description}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: HISTORIAL DEL VEHÍCULO */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Historial de kilometraje y servicios verificado en red de concesionarios oficiales.</span>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {(vehicle.historyLogs || [
                    { id: '1', date: '2022-04-10', title: 'Inscripción inicial 0 km', mileageKm: 0, description: 'Entrega en concesionario oficial', verifiedBy: 'Concesionario Oficial' },
                    { id: '2', date: '2023-05-18', title: 'Mantención Oficial 15.000 km', mileageKm: 14800, description: 'Cambio de aceite sintético y filtros', verifiedBy: 'Taller Homologado' },
                    { id: '3', date: '2024-06-20', title: 'Mantención Oficial 30.000 km', mileageKm: 29950, description: 'Inspección de frenos, bujías y scanner', verifiedBy: 'Taller Homologado' },
                  ]).map((log) => (
                    <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{log.title}</span>
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {log.mileageKm.toLocaleString('es-CL')} km
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{log.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-slate-400 block">{log.date}</span>
                        <span className="text-[11px] text-slate-500">{log.verifiedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: DOCUMENTACIÓN */}
            {activeTab === 'documentation' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(vehicle.documentation || [
                    { id: '1', name: 'Certificado de Anotaciones Vigentes (CAV)', type: 'padron', status: 'al_dia', verifiedAt: '2026-10-01' },
                    { id: '2', name: 'Revisión Técnica y Gases', type: 'revision_tecnica', status: 'vigente', verifiedAt: '2026-09-15' },
                    { id: '3', name: 'Permiso de Circulación y Seguro Obligatorio', type: 'garantia_oficial', status: 'al_dia', verifiedAt: '2026-09-01' },
                  ]).map((doc) => (
                    <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <FileCheck2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded uppercase">
                          {doc.status}
                        </span>
                      </div>
                      <h5 className="font-semibold text-slate-800">{doc.name}</h5>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Validado el {doc.verifiedAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: VIDEO TOUR */}
            {activeTab === 'video' && vehicle.videos && vehicle.videos.length > 0 && (
              <div className="bg-slate-900 rounded-xl p-6 text-white text-center space-y-3">
                <Video className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-display font-semibold text-base">
                  {vehicle.videos[0].title || 'Video Tour del Vehículo'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Visualiza el estado exterior, sonido de motor y habitáculo en video HD sin compresiones.
                </p>
                <a
                  href={vehicle.videos[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <span>Abrir Video en Nueva Pestaña</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* SECCIÓN 4: INFORME DE INSPECCIÓN 150 PUNTOS */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg font-mono">
                  {vehicle.inspectionScore}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-slate-900 flex items-center gap-1.5">
                    Certificación Mecánica y Legal
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </h3>
                  <p className="text-xs text-slate-500">150 puntos evaluados por mecánicos profesionales</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Sello de Calidad Aprobado
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {vehicle.inspectionItems?.map((chk) => (
                <div
                  key={chk.id}
                  className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50 text-xs"
                >
                  {chk.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-800 block">{chk.item}</span>
                    <span className="text-slate-500 text-[11px]">{chk.category}</span>
                    {chk.notes && <p className="text-amber-700 text-[11px] mt-0.5">{chk.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 5: SIMULADOR DE FINANCIAMIENTO */}
          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-amber-400">
              <Calculator className="w-5 h-5" />
              <h3 className="font-display font-semibold text-lg text-white">
                Simulador de Financiamiento y Crédito Automotriz
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Pie inicial ({downPaymentPercent}%):</span>
                    <span className="font-mono font-semibold text-white">
                      ${downPaymentAmount.toLocaleString('en-US')} USD
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Plazo de financiamiento:</span>
                    <span className="font-mono font-semibold text-white">{loanTermMonths} Meses</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={72}
                    step={12}
                    value={loanTermMonths}
                    onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-4 flex flex-col justify-between border border-slate-700">
                <div>
                  <span className="text-xs text-slate-400 block">Cuota mensual estimada</span>
                  <div className="font-display font-bold text-3xl text-amber-400 font-mono tabular-nums">
                    ${monthlyPayment} <span className="text-xs font-normal text-slate-300">USD/mes</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tasa de interés referencial anual: 8.9% CAE. Sujeto a evaluación.
                  </p>
                </div>

                <button
                  onClick={() => onOpenLeadModal(vehicle, 'oferta')}
                  className="mt-4 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Solicitar Pre-evaluación Crediticia
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER DEL MODAL */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Publicado en AutoMarket Pro · {vehicle.city}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>

      {/* MODAL ZOOM DE FOTOGRAFÍA FULL HD */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-70 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={vehicle.images[activeImageIndex] || vehicle.images[0]}
            alt="Foto Ampliada"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

    </div>
  );
};
