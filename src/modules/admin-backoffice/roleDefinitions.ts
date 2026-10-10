export type RoleDefinition = {
  name: 'superadministrador' | 'administrador' | 'concesionario' | 'vendedor_particular';
  label: string;
  description: string;
  visibleModules: string[];
  capabilities: string[];
};

/**
 * Definición funcional interna de los cuatro roles oficiales.
 * No se muestran permisos técnicos ni se permite editarlos desde el BackOffice.
 */
export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    name: 'superadministrador',
    label: 'Superadministrador',
    description: 'Control total de la plataforma, configuración, usuarios, operación y supervisión, sin intervenir en negociaciones de terceros.',
    visibleModules: [
      'Inicio', 'Usuarios', 'Roles y configuración', 'Vehículos', 'Publicaciones',
      'Moderación', 'Supervisión comercial', 'Clientes', 'Concesionarios', 'Leads', 'Mensajes',
      'Pruebas de manejo', 'Planes y pagos', 'Facturación', 'Publicidad', 'Reportes', 'Auditoría', 'Configuración',
    ],
    capabilities: [
      'Administrar usuarios y sus roles.',
      'Supervisar todos los vehículos, publicaciones y actividad comercial.',
      'Aprobar o rechazar publicaciones según las reglas de la plataforma.',
      'Consultar leads y ventas de vendedores y concesionarios sin modificar su negociación.',
      'Gestionar configuración global, reportes y auditoría.',
    ],
  },
  {
    name: 'administrador',
    label: 'Administrador',
    description: 'Gestiona la operación diaria y supervisa el marketplace sin modificar negociaciones de vendedores o concesionarios.',
    visibleModules: [
      'Inicio', 'Usuarios', 'Vehículos', 'Publicaciones', 'Moderación', 'Supervisión comercial',
      'Clientes', 'Concesionarios', 'Leads', 'Mensajes', 'Pruebas de manejo', 'Planes y pagos',
      'Facturación', 'Publicidad', 'Reportes',
    ],
    capabilities: [
      'Supervisar vehículos, publicaciones, leads y ventas de terceros.',
      'Aprobar o rechazar publicaciones.',
      'Consultar información de compradores y estados comerciales sin modificarlos.',
      'No cambiar estados de leads ni ejecutar acciones de contacto, negociación o cierre.',
      'Administrar usuarios operativos sin acceso a la configuración estructural.',
    ],
  },
  {
    name: 'concesionario',
    label: 'Concesionario',
    description: 'Administra el inventario y la actividad comercial de su concesionario.',
    visibleModules: [
      'Inicio', 'Mi concesionario', 'Vehículos', 'Publicaciones', 'Leads',
      'Mensajes', 'Pruebas de manejo', 'Planes y pagos', 'Facturación',
    ],
    capabilities: [
      'Administrar los vehículos de su concesionario.',
      'Crear y administrar publicaciones de su inventario.',
      'Gestionar leads, mensajes y pruebas de manejo recibidos.',
      'Cambiar el estado de sus leads y gestionar sus negociaciones.',
      'Consultar sus planes, pagos y facturas.',
    ],
  },
  {
    name: 'vendedor_particular',
    label: 'Vendedor particular',
    description: 'Publica y administra sus propios vehículos y atiende los contactos interesados.',
    visibleModules: [
      'Inicio', 'Mi perfil', 'Mis vehículos', 'Mis publicaciones', 'Mis leads',
      'Mensajes', 'Pruebas de manejo', 'Planes y pagos', 'Facturación',
    ],
    capabilities: [
      'Registrar y administrar sus propios vehículos.',
      'Crear, publicar, pausar y marcar como vendido sus publicaciones.',
      'Atender leads y mensajes de compradores.',
      'Cambiar el estado de sus leads y gestionar sus negociaciones.',
      'Gestionar sus pruebas de manejo, planes, pagos y facturas.',
    ],
  },
];

export const getRoleDefinition = (roleName: string): RoleDefinition | undefined =>
  ROLE_DEFINITIONS.find((role) => role.name === roleName);
