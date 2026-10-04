/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AutoMarket Pro - Enrutador Principal y Orquestador de Dominios
 * Cumple la regla de contacto:
 * - Visitante puede explorar vehículos libremente.
 * - Para contactar (mensaje, info, llamada, WhatsApp) o guardar favorito debe registrarse.
 * - Cada contacto genera un Lead registrado en la bandeja del vendedor.
 * - Estados de Lead: Nuevo | Contactado | En negociación | Vendido | Descartado
 */

import React, { useState } from 'react';
import { Vehicle, Lead, LeadContactType, LeadStatus } from './types/marketplace';
import { INITIAL_VEHICLES, INITIAL_LEADS } from './data/mockVehicles';
import { AuthStateManager } from './core/auth/auth.state';
import { PublicLayout } from './layouts/PublicLayout/PublicLayout';
import { HomeView } from './modules/home/HomeView';
import { CatalogView } from './modules/catalog/CatalogView';
import { VehicleDetailModal } from './modules/vehicle-detail/VehicleDetailModal';
import { LeadContactModal } from './modules/lead-management/LeadContactModal';
import { ComparisonView } from './modules/vehicle-comparison/ComparisonView';
import { PublishWizardModal } from './modules/vehicle-wizard/PublishWizardModal';
import { SellerDashboardView } from './modules/seller-crm/SellerDashboardView';
import { AdminDashboardView } from './modules/admin-backoffice/AdminDashboardView';
import { PromptsSuiteView } from './modules/prompts-suite/PromptsSuiteView';
import { AuthRequiredModal } from './modules/auth/AuthRequiredModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Estado Global del Marketplace
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [comparisonList, setComparisonList] = useState<Vehicle[]>([]);
  
  // Favoritos
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('automarket_user_favorites');
      return saved ? JSON.parse(saved) : ['veh-001'];
    } catch {
      return ['veh-001'];
    }
  });

  // Notificaciones Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Navegación
  const [currentView, setCurrentView] = useState<string>('home');
  const [catalogFilters, setCatalogFilters] = useState<Record<string, string | number>>({});

  // Modales
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [leadModalConfig, setLeadModalConfig] = useState<{
    isOpen: boolean;
    vehicle: Vehicle | null;
    type: LeadContactType;
  }>({
    isOpen: false,
    vehicle: null,
    type: 'mensaje',
  });

  // Modal de autenticación requerida para visitantes
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    actionContextText: string;
    pendingCallback?: () => void;
  }>({
    isOpen: false,
    actionContextText: 'contactar al vendedor',
  });

  // Guard de autenticación para visitantes
  const requireAuth = (contextText: string, callback: () => void) => {
    const session = AuthStateManager.getInstance().getSession();
    if (!session.isAuthenticated || session.user?.role === 'visitante') {
      setAuthModal({
        isOpen: true,
        actionContextText: contextText,
        pendingCallback: callback,
      });
      return;
    }
    callback();
  };

  // Gestión de Favoritos (Requiere ser cliente)
  const handleToggleFavorite = (vehicleId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(vehicleId);
      const updated = exists ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId];
      localStorage.setItem('automarket_user_favorites', JSON.stringify(updated));
      showToast(exists ? 'Vehículo removido de favoritos' : '¡Vehículo guardado en tus favoritos!');
      return updated;
    });
  };

  // Acciones de Catálogo y Navegación
  const handleNavigateToCatalog = (filters?: Record<string, string | number>) => {
    if (filters) setCatalogFilters(filters);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (vehicle: Vehicle) => {
    setComparisonList((prev) => {
      const exists = prev.some((v) => v.id === vehicle.id);
      if (exists) {
        return prev.filter((v) => v.id !== vehicle.id);
      }
      if (prev.length >= 3) {
        showToast('Máximo 3 vehículos para comparar simultáneamente');
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  // Creación de Vehículo desde el Wizard
  const handlePublishVehicle = (newVehicleData: Partial<Vehicle>) => {
    const fullVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      sellerId: 'usr-dealer-01',
      title: newVehicleData.title || 'Vehículo Seminuevo',
      make: newVehicleData.make || 'BMW',
      model: newVehicleData.model || 'Serie 3',
      version: newVehicleData.version || 'Sport',
      year: newVehicleData.year || 2022,
      priceUsd: newVehicleData.priceUsd || 28000,
      mileageKm: newVehicleData.mileageKm || 30000,
      fuelType: newVehicleData.fuelType || 'Gasolina',
      transmission: newVehicleData.transmission || 'Automática',
      bodyType: newVehicleData.bodyType || 'Sedán',
      doors: newVehicleData.doors || 4,
      passengers: newVehicleData.passengers || 5,
      engine: newVehicleData.engine || '2.0L Turbo',
      horsepower: newVehicleData.horsepower || 184,
      traction: newVehicleData.traction || 'RWD',
      color: newVehicleData.color || 'Gris Grafito',
      city: newVehicleData.city || 'Santiago',
      region: 'Metropolitana',
      images: newVehicleData.images || [],
      features: newVehicleData.features || [],
      description: newVehicleData.description || '',
      status: 'publicado',
      plan: newVehicleData.plan || 'destacado',
      planExpiresAt: newVehicleData.planExpiresAt || '2026-11-30',
      inspectionScore: newVehicleData.inspectionScore || 94,
      inspectionItems: [
        { id: '1', category: 'Motor y Transmisión', item: 'Compresión y hermeticidad de juntas', status: 'passed' },
        { id: '2', category: 'Frenos y Suspensión', item: 'Espesor de pastillas y discos', status: 'passed' },
        { id: '3', category: 'Carrocería y Pintura', item: 'Pintura original sin repintados', status: 'passed' },
      ],
      viewsCount: 1,
      leadsCount: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      isFeatured: newVehicleData.isFeatured || false,
      vinSnippet: newVehicleData.vinSnippet || 'WBA5R1C5...1192',
      plateSnippet: newVehicleData.plateSnippet || 'TR-44-12',
      seller: newVehicleData.seller as any,
    };

    setVehicles((prev) => [fullVehicle, ...prev]);
    showToast('¡Vehículo publicado y catalogado con éxito!');
  };

  // Creación de Lead (Cumple la regla: Todo contacto genera un Lead con status 'Nuevo')
  const handleCreateLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now().toString().slice(-6)}`,
      status: 'Nuevo',
      createdAt: formattedDate,
    };

    setLeads((prev) => [newLead, ...prev]);

    // Incrementar contador de leads en el vehículo
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === leadData.vehicleId ? { ...v, leadsCount: (v.leadsCount || 0) + 1 } : v
      )
    );

    showToast(`¡Lead #${newLead.id} generado exitosamente! Notificación enviada al vendedor.`);
  };

  // Acciones Administrativas de Moderación (Aprobar, Rechazar, Suspender, Destacar)
  const handleApproveVehicle = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId ? { ...v, status: 'publicado', publishedAt: new Date().toISOString().split('T')[0] } : v
      )
    );
    showToast('Publicación aprobada y publicada en el catálogo.');
  };

  const handleRejectVehicle = (vehicleId: string, reason: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId ? { ...v, status: 'rechazado' } : v
      )
    );
    showToast(`Publicación rechazada. Motivo: ${reason}`);
  };

  const handleSuspendVehicle = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId ? { ...v, status: 'en_pausa' } : v
      )
    );
    showToast('Publicación suspendida cautelarmente por el administrador.');
  };

  const handleToggleFeatureVehicle = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const nextFeatured = !v.isFeatured;
          showToast(nextFeatured ? '¡Publicación destacada en catálogo y home!' : 'Distintivo de destacado retirado');
          return { ...v, isFeatured: nextFeatured };
        }
        return v;
      })
    );
  };

  // Acciones de Vendedor
  const handleToggleVehicleStatus = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const nextStatus = v.status === 'publicado' ? 'en_pausa' : 'publicado';
          showToast(`Vehículo ${nextStatus === 'publicado' ? 'reactivado' : 'pausado'}`);
          return {
            ...v,
            status: nextStatus,
          };
        }
        return v;
      })
    );
  };

  // Actualización de estado del lead por el vendedor
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    showToast(`Estado del Lead actualizado a "${status}"`);
  };

  return (
    <PublicLayout
      currentView={currentView}
      onNavigate={(v) => {
        setCurrentView(v);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onOpenPublish={() => {
        requireAuth('publicar un vehículo', () => setIsPublishModalOpen(true));
      }}
      comparisonCount={comparisonList.length}
    >
      {/* VISTA 1: HOME */}
      {currentView === 'home' && (
        <HomeView
          featuredVehicles={vehicles.filter((v) => v.status === 'publicado')}
          onSelectVehicle={(v) => setSelectedVehicle(v)}
          onNavigateToCatalog={handleNavigateToCatalog}
          onOpenPublish={() => {
            requireAuth('publicar un vehículo', () => setIsPublishModalOpen(true));
          }}
        />
      )}

      {/* VISTA 2: CATÁLOGO FACETADO */}
      {currentView === 'catalog' && (
        <CatalogView
          vehicles={vehicles}
          onSelectVehicle={(v) => setSelectedVehicle(v)}
          onToggleCompare={handleToggleCompare}
          comparisonList={comparisonList}
          initialFilters={catalogFilters}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onRequireAuth={requireAuth}
        />
      )}

      {/* VISTA 3: COMPARADOR */}
      {currentView === 'compare' && (
        <ComparisonView
          vehicles={comparisonList}
          onRemoveFromCompare={(id) =>
            setComparisonList((prev) => prev.filter((v) => v.id !== id))
          }
          onClearAll={() => setComparisonList([])}
          onSelectVehicle={(v) => setSelectedVehicle(v)}
          onNavigateToCatalog={() => setCurrentView('catalog')}
        />
      )}

      {/* VISTA 4: PANEL DE VENDEDOR & CONCESIONARIO (CRM DE LEADS) */}
      {currentView === 'seller_dashboard' && (
        <SellerDashboardView
          vehicles={vehicles}
          leads={leads}
          onOpenPublish={() => setIsPublishModalOpen(true)}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onToggleVehicleStatus={handleToggleVehicleStatus}
        />
      )}

      {/* VISTA 5: BACKOFFICE ADMINISTRATIVO & MODERACIÓN (20 MÓDULOS) */}
      {currentView === 'admin_dashboard' && (
        <AdminDashboardView
          vehicles={vehicles}
          leads={leads}
          onApproveVehicle={handleApproveVehicle}
          onRejectVehicle={handleRejectVehicle}
          onSuspendVehicle={handleSuspendVehicle}
          onToggleFeatureVehicle={handleToggleFeatureVehicle}
          onSelectVehicle={(v) => setSelectedVehicle(v)}
        />
      )}

      {/* VISTA 6: SUITE MAESTRA 17 PROMPTS */}
      {currentView === 'prompts_suite' && <PromptsSuiteView />}

      {/* MODAL DETALLE VEHÍCULO (PDP) */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        isFavorite={selectedVehicle ? favorites.includes(selectedVehicle.id) : false}
        onToggleFavorite={(veh) => handleToggleFavorite(veh.id)}
        onRequireAuth={requireAuth}
        onOpenLeadModal={(v, type) => {
          requireAuth('contactar al vendedor', () => {
            setLeadModalConfig({ isOpen: true, vehicle: v, type });
          });
        }}
      />

      {/* MODAL CONTACTO Y CAPTURA DE LEADS (GENERADOR OFICIAL DE LEADS) */}
      {leadModalConfig.isOpen && (
        <LeadContactModal
          vehicle={leadModalConfig.vehicle}
          type={leadModalConfig.type}
          onClose={() => setLeadModalConfig({ isOpen: false, vehicle: null, type: 'mensaje' })}
          onSubmitLead={handleCreateLead}
        />
      )}

      {/* MODAL DE REGISTRO OBLIGATORIO PARA VISITANTES */}
      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, actionContextText: 'contactar al vendedor' })}
        actionContextText={authModal.actionContextText}
        onAuthenticated={() => {
          showToast('¡Registro completado! Ahora estás autenticado como Cliente.');
          if (authModal.pendingCallback) {
            authModal.pendingCallback();
          }
        }}
      />

      {/* WIZARD DE PUBLICACIÓN */}
      <PublishWizardModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublishVehicle={handlePublishVehicle}
      />

      {/* TOAST FLOTANTE DE FEEDBACK EN TIEMPO REAL */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-70 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium text-slate-100">{toastMessage}</p>
        </div>
      )}
    </PublicLayout>
  );
}
