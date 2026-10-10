import React from 'react';
import { AuthStateManager } from './auth.state';

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Control de visibilidad de funcionalidades en React.
 * La protección real de datos/operaciones debe mantenerse en Laravel mediante
 * el middleware permission:...; este componente evita mostrar acciones que el
 * usuario no tiene habilitadas.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({ permission, children, fallback = null }) => {
  const auth = AuthStateManager.getInstance();
  return auth.hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
};
