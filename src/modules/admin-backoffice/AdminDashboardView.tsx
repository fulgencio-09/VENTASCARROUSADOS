import React from 'react';
import { Vehicle, Lead } from '../../types/marketplace';
import { AdminDatabaseView } from './AdminDatabaseView';
import { PermissionFeaturePanel } from './PermissionFeaturePanel';

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
 * La vista de gestión mantiene la administración de usuarios, roles y permisos
 * y ahora muestra un panel de las funcionalidades que quedan activadas por
 * las casillas marcadas en cada rol.
 */
export const AdminDashboardView: React.FC<AdminDashboardViewProps> = () => {
  return (
    <div className="space-y-6">
      <AdminDatabaseView />
      <PermissionFeaturePanel />
    </div>
  );
};
