export type RoleDefinition = {
  name: 'superadministrador' | 'administrador' | 'concesionario' | 'vendedor_particular';
  label: string;
  description: string;
  visibleModules: string[];
  capabilities: string[];
};

/**
 * Definición funcional interna de los cuatro roles oficiales.
 *
 * No se muestran permisos técnicos ni se permite editarlos desde el BackOffice.
 * Esta matriz es la fuente funcional para decidir qué módulos y acciones debe
 * recibir cada tipo de usuario.
 */
export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    name: 'superadministrador',
    label: 'Superadministrador',
    description: 'Control total de la plataforma, configuración, usuarios, operación y supervisión.',
    visibleModules: [
      'Inicio', 'Usuarios', 'Roles y configuración', 'Vehículos', 'Publicaciones',
      'Moderación', 'Clientes', 'Concesionarios', 'Leads', 'Mensajes', 'Pruebas de manejo',
      'Planes y pagos', 'Facturación', 'Publicidad', 'Reportes', 'Auditoría', 'Configuración',
    ],
    capabilities: [
      'Administrar usuarios y sus roles.',
      'Supervisar y administrar todos los vehículos y publicaciones.',
      'Gestionar clientes, concesionarios, leads y operaciones comerciales.',
      'Gestionar planes, pagos, facturación y publicidad.',
      'Consultar reportes, auditoría y configuración global.',
    ],
  },
  {
    name: 'administrador',
    label: 'Administrador',
    description: 'Gestiona la operación diaria del marketplace sin modificar la estructura de seguridad del sistema.',
    visibleModules: [
      'Inicio', 'Usuarios', 'Vehículos', 'Publicaciones', 'Moderación', 'Clientes',
      'Concesionarios', 'Leads', 'Mensajes', 'Pruebas de manejo', 'Planes y pagos',
      'Facturación', 'Publicidad', 'Reportes',
    ],
    capabilities: [
      'Gestionar la operación de vehículos y publicaciones.',
      'Revisar y moderar publicaciones.',
      'Atender clientes, leads, mensajes y pruebas de manejo.',
      'Consultar la operación comercial y sus reportes.',
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
      'Gestionar sus pruebas de manejo, planes, pagos y facturas.',
    ],
  },
];

export const getRoleDefinition = (roleName: string): RoleDefinition | undefined =>
  ROLE_DEFINITIONS.find((role) => role.name === roleName);
