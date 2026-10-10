/* Updated below: all vehicle prices are COP. */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AutoMarket Pro - Enrutador Principal y Orquestador de Dominios
 */

import React, { useEffect, useState } from 'react';
import { Vehicle, Lead, LeadContactType, LeadStatus } from './types/marketplace';
import { INITIAL_VEHICLES, INITIAL_LEADS } from './data/mockVehicles';
import { AuthStateManager } from './core/auth/auth.state';
import { getVehicles, createVehicle } from './core/api/vehicles.api';
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

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [comparisonList, setComparisonList] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('automarket_user_favorites');
      return saved ? JSON.parse(saved) : ['veh-001'];
    } catch {
      return ['veh-001'];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [catalogFilters, setCatalogFilters] = useState<Record<string, string | number>>({});
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [leadModalConfig, setLeadModalConfig] = useState<{ isOpen: boolean; vehicle: Vehicle | null; type: LeadContactType }>({ isOpen: false, vehicle: null, type: 'mensaje' });
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; actionContextText: string; pendingCallback?: () => void }>({ isOpen: false, actionContextText: 'contactar al vendedor' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Fuente de verdad del catálogo: la base de datos. Los mocks solo quedan como
  // respaldo visual si la API todavía no está disponible en el entorno local.
  useEffect(() => {
    let cancelled = false;

    getVehicles({ perPage: 48 })
      .then(({ vehicles: persistedVehicles }) => {
        if (!cancelled) setVehicles(persistedVehicles);
      })
      .catch(() => {
        if (!cancelled) showToast('No fue posible consultar la base de datos. Se muestran datos de demostración.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requireAuth = (contextText: string, callback: () => void) => {
    const session = AuthStateManager.getInstance().getSession();
    if (!session.isAuthenticated || session.user?.role === 'visitante') {
      setAuthModal({ isOpen: true, actionContextText: contextText, pendingCallback: callback });
      return;
    }
    callback();
  };

  const handleToggleFavorite = (vehicleId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(vehicleId);
      const updated = exists ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId];
      localStorage.setItem('automarket_user_favorites', JSON.stringify(updated));
      showToast(exists ? 'Vehículo removido de favoritos' : '¡Vehículo guardado en tus favoritos!');
      return updated;
    });
  };

  const handleNavigateToCatalog = (filters?: Record<string, string | number>) => {
    if (filters) setCatalogFilters(filters);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompare = (vehicle: Vehicle) => {
    setComparisonList((prev) => {
      if (prev.some((v) => v.id === vehicle.id)) return prev.filter((v) => v.id !== vehicle.id);
      if (prev.length >= 3) {
        showToast('Máximo 3 vehículos para comparar simultáneamente');
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  const handlePublishVehicle = async (newVehicleData: Partial<Vehicle>) => {
    try {
      const persistedVehicle = await createVehicle(newVehicleData);
      setVehicles((prev) => [persistedVehicle, ...prev.filter((v) => v.id !== persistedVehicle.id)]);
      showToast('¡Vehículo registrado en la base de datos y enviado a aprobación!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible registrar el vehículo.';
      showToast(message);
    }
  };

  const handleCreateLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLead: Lead = { ...leadData, id: `lead-${Date.now().toString().slice(-6)}`, status: 'Nuevo', createdAt: formattedDate };
    setLeads((prev) => [newLead, ...prev]);
    setVehicles((prev) => prev.map((v) => v.id === leadData.vehicleId ? { ...v, leadsCount: (v.leadsCount || 0) + 1 } : v));
    showToast(`¡Lead #${newLead.id} generado exitosamente! Notificación enviada al vendedor.`);
  };

  const handleApproveVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.map((v) => v.id === vehicleId ? { ...v, status: 'publicado', publishedAt: new Date().toISOString().split('T')[0] } : v));
    showToast('Publicación aprobada y publicada en el catálogo.');
  };
  const handleRejectVehicle = (vehicleId: string, reason: string) => {
    setVehicles((prev) => prev.map((v) => v.id === vehicleId ? { ...v, status: 'rechazado' } : v));
    showToast(`Publicación rechazada. Motivo: ${reason}`);
  };
  const handleSuspendVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.map((v) => v.id === vehicleId ? { ...v, status: 'en_pausa' } : v));
    showToast('Publicación suspendida cautelarmente por el administrador.');
  };
  const handleToggleFeatureVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.map((v) => {
      if (v.id !== vehicleId) return v;
      const nextFeatured = !v.isFeatured;
      showToast(nextFeatured ? '¡Publicación destacada en catálogo y home!' : 'Distintivo de destacado retirado');
      return { ...v, isFeatured: nextFeatured };
    }));
  };
  const handleToggleVehicleStatus = (vehicleId: string) => {
    setVehicles((prev) => prev.map((v) => {
      if (v.id !== vehicleId) return v;
      const nextStatus = v.status === 'publicado' ? 'en_pausa' : 'publicado';
      showToast(`Vehículo ${nextStatus === 'publicado' ? 'reactivado' : 'pausado'}`);
      return { ...v, status: nextStatus };
    }));
  };
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status } : l));
    showToast(`Estado del Lead actualizado a "${status}"`);
  };

  return (
    <PublicLayout
      currentView={currentView}
      onNavigate={(v) => { setCurrentView(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      onOpenPublish={() => requireAuth('publicar un vehículo', () => setIsPublishModalOpen(true))}
      comparisonCount={comparisonList.length}
    >
      {currentView === 'home' && <HomeView featuredVehicles={vehicles.filter((v) => v.status === 'publicado')} onSelectVehicle={setSelectedVehicle} onNavigateToCatalog={handleNavigateToCatalog} onOpenPublish={() => requireAuth('publicar un vehículo', () => setIsPublishModalOpen(true))} />}
      {currentView === 'catalog' && <CatalogView vehicles={vehicles} onSelectVehicle={setSelectedVehicle} onToggleCompare={handleToggleCompare} comparisonList={comparisonList} initialFilters={catalogFilters} favorites={favorites} onToggleFavorite={handleToggleFavorite} onRequireAuth={requireAuth} />}
      {currentView === 'compare' && <ComparisonView vehicles={comparisonList} onRemoveFromCompare={(id) => setComparisonList((prev) => prev.filter((v) => v.id !== id))} onClearAll={() => setComparisonList([])} onSelectVehicle={setSelectedVehicle} onNavigateToCatalog={() => setCurrentView('catalog')} />}
      {currentView === 'seller_dashboard' && <SellerDashboardView vehicles={vehicles} leads={leads} onOpenPublish={() => setIsPublishModalOpen(true)} onUpdateLeadStatus={handleUpdateLeadStatus} onToggleVehicleStatus={handleToggleVehicleStatus} />}
      {currentView === 'admin_dashboard' && <AdminDashboardView vehicles={vehicles} leads={leads} onApproveVehicle={handleApproveVehicle} onRejectVehicle={handleRejectVehicle} onSuspendVehicle={handleSuspendVehicle} onToggleFeatureVehicle={handleToggleFeatureVehicle} onSelectVehicle={setSelectedVehicle} />}
      {currentView === 'prompts_suite' && <PromptsSuiteView />}

      <VehicleDetailModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} isFavorite={selectedVehicle ? favorites.includes(selectedVehicle.id) : false} onToggleFavorite={(veh) => handleToggleFavorite(veh.id)} onRequireAuth={requireAuth} onOpenLeadModal={(v, type) => requireAuth('contactar al vendedor', () => setLeadModalConfig({ isOpen: true, vehicle: v, type }))} />
      {leadModalConfig.isOpen && <LeadContactModal vehicle={leadModalConfig.vehicle} type={leadModalConfig.type} onClose={() => setLeadModalConfig({ isOpen: false, vehicle: null, type: 'mensaje' })} onSubmitLead={handleCreateLead} />}
      <AuthRequiredModal isOpen={authModal.isOpen} actionContextText={authModal.actionContextText} onClose={() => setAuthModal({ isOpen: false, actionContextText: 'contactar al vendedor' })} onAuthenticated={() => { const callback = authModal.pendingCallback; setAuthModal({ isOpen: false, actionContextText: 'contactar al vendedor' }); callback?.(); }} />
      <PublishWizardModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} onPublishVehicle={handlePublishVehicle} />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-sm">{toastMessage}</div>
      )}
    </PublicLayout>
  );
}
