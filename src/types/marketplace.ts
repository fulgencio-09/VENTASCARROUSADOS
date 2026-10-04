/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AutoMarket Pro - Definiciones de Tipos y Modelos de Dominio
 * Módulo de Vehículos Completo: Specs, Multimedia, Historial, Documentación y Videos
 */

export type UserRole = 
  | 'visitante'
  | 'cliente'
  | 'vendedor_particular'
  | 'concesionario'
  | 'moderador'
  | 'administrador'
  | 'superadministrador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  dealerName?: string;
  isKycVerified: boolean;
  city: string;
  joinedAt: string;
}

export type FuelType = 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico' | 'GLP/GNC';
export type TransmissionType = 'Automática' | 'Manual' | 'CVT' | 'Doble Embrague';
export type BodyType = 'SUV' | 'Sedán' | 'Hatchback' | 'Pick-up' | 'Coupé' | 'Convertible';
export type ListingStatus = 'publicado' | 'pendiente_aprobacion' | 'en_pausa' | 'vendido' | 'rechazado';
export type PlanTier = 'free' | 'destacado' | 'premium';

export interface VehicleImageItem {
  id: string;
  url: string;
  urlThumbnail: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface VehicleVideoItem {
  id: string;
  url: string;
  provider: 'youtube' | 'vimeo' | 's3_direct';
  title?: string;
}

export interface VehicleDocumentItem {
  id: string;
  name: string;
  type: 'padron' | 'revision_tecnica' | 'certificado_anotaciones' | 'garantia_oficial';
  status: 'vigente' | 'al_dia' | 'certificado';
  verifiedAt: string;
}

export interface VehicleHistoryLogItem {
  id: string;
  date: string;
  title: string;
  mileageKm: number;
  description: string;
  verifiedBy: string;
}

export interface InspectionCheckItem {
  id: string;
  category: 'Motor y Transmisión' | 'Frenos y Suspensión' | 'Carrocería y Pintura' | 'Interior y Eléctrico' | 'Legal y Documentación';
  item: string;
  status: 'passed' | 'warning' | 'needs_attention';
  notes?: string;
}

export interface Vehicle {
  id: string;
  sellerId: string;
  seller: {
    name: string;
    type: 'particular' | 'concesionaria';
    rating: number;
    totalReviews: number;
    isVerified: boolean;
    phone: string;
    city: string;
  };
  title: string;
  make: string;
  model: string;
  version: string;
  year: number;
  priceUsd: number;
  mileageKm: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  doors: number;
  passengers: number; // Requerido: Número de pasajeros
  engine: string;     // Requerido: Motor
  horsepower: number; // Requerido: Potencia
  traction: '4x2' | '4x4' | 'AWD' | 'FWD' | 'RWD';
  color: string;      // Requerido: Color
  city: string;       // Requerido: Ciudad
  region: string;
  images: string[];   // Lista de URLs de imágenes
  imageItems?: VehicleImageItem[]; // Lista estructurada con orden y principal
  videos?: VehicleVideoItem[];     // Requerido: Videos
  features: string[]; // Equipamiento y características
  description: string;
  documentation?: VehicleDocumentItem[]; // Requerido: Documentación
  historyLogs?: VehicleHistoryLogItem[]; // Requerido: Historial
  status: ListingStatus;
  plan: PlanTier;
  planExpiresAt: string;
  inspectionScore: number; // 0 - 100
  inspectionItems: InspectionCheckItem[];
  viewsCount: number;
  leadsCount: number;
  publishedAt: string;
  isFeatured: boolean;
  vinSnippet: string;
  plateSnippet: string;
}

export type LeadStatus = 'Nuevo' | 'Contactado' | 'En negociación' | 'Vendido' | 'Descartado';
export type LeadContactType = 'mensaje' | 'solicitud_informacion' | 'solicitar_llamada' | 'whatsapp' | 'test_drive' | 'oferta';

export interface Lead {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehiclePriceUsd: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  type: LeadContactType;
  message: string;
  preferredCallTime?: string;
  preferredDate?: string;
  offeredPriceUsd?: number;
  status: LeadStatus;
  createdAt: string;
}

export interface PublicationPlan {
  id: PlanTier;
  name: string;
  priceUsd: number;
  durationDays: number;
  photoLimit: number;
  features: string[];
  boostPriority: number;
  isPopular?: boolean;
}

export interface SystemPromptSpec {
  id: string;
  number: string;
  title: string;
  phase: string;
  scopeSummary: string;
  strictContinuityClause: string;
  promptContent: string;
  codeArtifactName: string;
  codeArtifactLang: string;
  codeArtifactSnippet: string;
  dependencies: string[];
}
