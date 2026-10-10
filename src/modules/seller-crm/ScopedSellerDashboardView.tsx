import React, { useMemo } from 'react';
import { AuthStateManager } from '../../core/auth/auth.state';
import { Lead, LeadStatus, Vehicle } from '../../types/marketplace';
import { SellerDashboardView } from './SellerDashboardView';

interface ScopedSellerDashboardViewProps {
  vehicles: Vehicle[];
  leads: Lead[];
  onOpenPublish: () => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onToggleVehicleStatus: (vehicleId: string) => void;
}

/**
 * El CRM comercial solo trabaja con los activos del vendedor/concesionario
 * autenticado. Nunca debe recibir para operar sobre ventas de terceros.
 */
export const ScopedSellerDashboardView: React.FC<ScopedSellerDashboardViewProps> = (props) => {
  const session = AuthStateManager.getInstance().getSession();
  const currentUserId = session.user?.id;

  const ownVehicles = useMemo(
    () => currentUserId ? props.vehicles.filter((vehicle) => vehicle.sellerId === currentUserId) : [],
    [props.vehicles, currentUserId],
  );

  const ownVehicleIds = useMemo(
    () => new Set(ownVehicles.map((vehicle) => vehicle.id)),
    [ownVehicles],
  );

  const ownLeads = useMemo(
    () => props.leads.filter((lead) => ownVehicleIds.has(lead.vehicleId)),
    [props.leads, ownVehicleIds],
  );

  return (
    <SellerDashboardView
      vehicles={ownVehicles}
      leads={ownLeads}
      onOpenPublish={props.onOpenPublish}
      onUpdateLeadStatus={props.onUpdateLeadStatus}
      onToggleVehicleStatus={props.onToggleVehicleStatus}
    />
  );
};
