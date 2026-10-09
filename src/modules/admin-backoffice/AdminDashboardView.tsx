import React from 'react';
import { Vehicle, Lead } from '../../types/marketplace';
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

/**
 * BackOffice Administrativo.
 *
 * La vista ya no presenta registros mock para los módulos administrativos.
 * La gestión se realiza mediante la API Laravel y la base de datos AutoMarket Pro.
 * Los props de operación se mantienen temporalmente para conservar el contrato
 * con App.tsx mientras los demás módulos son migrados a persistencia real.
 */
export const AdminDashboardView: React.FC<AdminDashboardViewProps> = () => {
  return <AdminDatabaseView />;
};
