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
 * La configuración de capacidades es interna al sistema y se define por rol.
 * No se expone al usuario final una matriz de permisos técnicos.
 */
export const AdminDashboardView: React.FC<AdminDashboardViewProps> = () => {
  return <AdminDatabaseView />;
};
