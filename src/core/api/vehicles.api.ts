import { Vehicle } from '../../types/marketplace';
import { APP_CONFIG } from '../config/app.config';

interface VehicleApiResponse {
  data: Array<Record<string, unknown>>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem(APP_CONFIG.storageKeys.authToken);
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

const toVehicle = (raw: Record<string, unknown>): Vehicle => ({
  id: String(raw.id ?? raw.uuid ?? ''),
  sellerId: String(raw.sellerId ?? ''),
  seller: {
    name: String(raw.sellerName ?? 'Vendedor AutoMarket Pro'),
    type: raw.sellerType === 'concesionaria' ? 'concesionaria' : 'particular',
    rating: Number(raw.sellerRating ?? 0),
    totalReviews: Number(raw.sellerReviews ?? 0),
    isVerified: Boolean(raw.sellerVerified ?? false),
    phone: String(raw.sellerPhone ?? ''),
    city: String(raw.city ?? ''),
  },
  title: String(raw.title ?? 'Vehículo Seminuevo'),
  make: String(raw.make ?? ''),
  model: String(raw.model ?? ''),
  version: String(raw.version ?? ''),
  year: Number(raw.year ?? 0),
  priceCop: raw.priceCop == null ? undefined : Number(raw.priceCop),
  mileageKm: Number(raw.mileageKm ?? 0),
  fuelType: String(raw.fuelType ?? 'Gasolina') as Vehicle['fuelType'],
  transmission: String(raw.transmission ?? 'Automática') as Vehicle['transmission'],
  bodyType: String(raw.bodyType ?? 'Sedán') as Vehicle['bodyType'],
  doors: Number(raw.doors ?? 0),
  passengers: Number(raw.passengers ?? 0),
  engine: String(raw.engine ?? ''),
  horsepower: Number(raw.horsepower ?? 0),
  traction: String(raw.traction ?? 'FWD') as Vehicle['traction'],
  color: String(raw.color ?? ''),
  city: String(raw.city ?? ''),
  region: String(raw.region ?? ''),
  images: Array.isArray(raw.images) ? raw.images.map(String) : [],
  features: Array.isArray(raw.features) ? raw.features.map(String) : [],
  description: String(raw.description ?? ''),
  status: String(raw.status ?? 'publicado') as Vehicle['status'],
  plan: String(raw.plan ?? 'free') as Vehicle['plan'],
  planExpiresAt: String(raw.planExpiresAt ?? ''),
  inspectionScore: Number(raw.inspectionScore ?? 0),
  inspectionItems: [],
  viewsCount: Number(raw.viewsCount ?? 0),
  leadsCount: Number(raw.leadsCount ?? 0),
  publishedAt: String(raw.publishedAt ?? ''),
  isFeatured: Boolean(raw.isFeatured ?? false),
  vinSnippet: String(raw.vinSnippet ?? ''),
  plateSnippet: String(raw.plateSnippet ?? ''),
});

async function apiRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');

  Object.entries(authHeaders()).forEach(([key, value]) => {
    if (value) headers.set(key, String(value));
  });

  return fetch(`${APP_CONFIG.apiBaseUrl}${path}`, { ...init, headers });
}

async function readError(response: Response): Promise<string> {
  const data = await response.json().catch(() => ({}));
  if (data?.errors) {
    return Object.values(data.errors as Record<string, string[]>).flat().join(' ');
  }
  return data?.message || 'No fue posible completar la operación con los vehículos.';
}

export async function getVehicles(params?: { mine?: boolean; search?: string; perPage?: number }): Promise<VehicleApiResponse & { vehicles: Vehicle[] }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  query.set('per_page', String(params?.perPage ?? APP_CONFIG.pagination.defaultPageSize));

  const path = params?.mine ? `/vehicles/mine?${query.toString()}` : `/vehicles?${query.toString()}`;
  const response = await apiRequest(path);
  if (!response.ok) throw new Error(await readError(response));

  const data = await response.json() as VehicleApiResponse;
  return { ...data, vehicles: data.data.map(toVehicle) };
}

export async function createVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
  const response = await apiRequest('/vehicles', {
    method: 'POST',
    body: JSON.stringify({
      title: vehicle.title,
      make: vehicle.make,
      model: vehicle.model,
      version: vehicle.version,
      year: vehicle.year,
      mileage_km: vehicle.mileageKm,
      fuel_type: vehicle.fuelType,
      transmission: vehicle.transmission,
      body_type: vehicle.bodyType,
      color: vehicle.color,
      traction: vehicle.traction,
      doors: vehicle.doors,
      passengers: vehicle.passengers,
      engine: vehicle.engine,
      city: vehicle.city,
      price_cop: vehicle.priceCop,
      description: vehicle.description,
      plan: vehicle.plan,
      is_negotiable: false,
      plate_snippet: vehicle.plateSnippet,
      vin_snippet: vehicle.vinSnippet,
    }),
  });

  if (!response.ok) throw new Error(await readError(response));

  const data = await response.json() as { data: Record<string, unknown> };
  return toVehicle(data.data);
}
