/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Módulo Público de Catálogo: Búsqueda Facetada Completa, SEO Dinámico, Carga Progresiva, URLs Amigables y Paginación
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle } from '../../types/marketplace';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ShieldCheck,
  RotateCcw,
  Scale,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Sparkles,
  DollarSign,
  Zap,
  CheckCircle2,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  Tag,
} from 'lucide-react';

import { AuthStateManager } from '../../core/auth/auth.state';

interface CatalogViewProps {
  vehicles: Vehicle[];
  onSelectVehicle: (v: Vehicle) => void;
  onToggleCompare: (v: Vehicle) => void;
  comparisonList: Vehicle[];
  initialFilters?: Record<string, string | number>;
  favorites?: string[];
  onToggleFavorite?: (vehicleId: string) => void;
  onRequireAuth?: (actionContext: string, pendingCallback: () => void) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  vehicles,
  onSelectVehicle,
  onToggleCompare,
  comparisonList,
  initialFilters = {},
  favorites: externalFavorites,
  onToggleFavorite,
  onRequireAuth,
}) => {
  // 1. Estados de Todos los Filtros Requeridos
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMake, setSelectedMake] = useState<string>((initialFilters.make as string) || '');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>((initialFilters.maxPrice as number) || 60000);
  const [minYear, setMinYear] = useState<number>(2017);
  const [maxYear, setMaxYear] = useState<number>(2024);
  const [maxMileage, setMaxMileage] = useState<number>(120000);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('');
  const [selectedBodyType, setSelectedBodyType] = useState<string>((initialFilters.bodyType as string) || '');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedEngine, setSelectedEngine] = useState<string>('');
  
  // Toggles Booleanos de Negocio
  const [onlyFinanciable, setOnlyFinanciable] = useState<boolean>(false);
  const [onlyNegociable, setOnlyNegociable] = useState<boolean>(false);
  const [onlyPremium, setOnlyPremium] = useState<boolean>(false);
  const [onlyDestacado, setOnlyDestacado] = useState<boolean>(false);
  const [onlyCertified, setOnlyCertified] = useState<boolean>(false);

  // Ordenamiento, Vistas y Paginación
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Favoritos Persistentes
  const [localFavorites, setLocalFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('automarket_user_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const favorites = externalFavorites || localFavorites;

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const session = AuthStateManager.getInstance().getSession();
    if (!session.isAuthenticated || session.user?.role === 'visitante') {
      if (onRequireAuth) {
        onRequireAuth('guardar este vehículo en tus favoritos', () => {
          if (onToggleFavorite) {
            onToggleFavorite(id);
          } else {
            setLocalFavorites((prev) => {
              const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
              localStorage.setItem('automarket_user_favorites', JSON.stringify(updated));
              return updated;
            });
          }
        });
        return;
      }
    }

    if (onToggleFavorite) {
      onToggleFavorite(id);
    } else {
      setLocalFavorites((prev) => {
        const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        localStorage.setItem('automarket_user_favorites', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const isVehicleCompared = (id: string) => comparisonList.some((v) => v.id === id);

  // Listas Dinámicas de Opciones (Cascada)
  const makes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make))).sort(), [vehicles]);
  
  const models = useMemo(() => {
    const list = selectedMake ? vehicles.filter((v) => v.make === selectedMake) : vehicles;
    return Array.from(new Set(list.map((v) => v.model))).sort();
  }, [vehicles, selectedMake]);

  const versions = useMemo(() => {
    let list = vehicles;
    if (selectedMake) list = list.filter((v) => v.make === selectedMake);
    if (selectedModel) list = list.filter((v) => v.model === selectedModel);
    return Array.from(new Set(list.map((v) => v.version))).sort();
  }, [vehicles, selectedMake, selectedModel]);

  const cities = useMemo(() => Array.from(new Set(vehicles.map((v) => v.city))).sort(), [vehicles]);
  const departments = useMemo(() => Array.from(new Set(vehicles.map((v) => v.region))).sort(), [vehicles]);
  const fuelTypes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.fuelType))).sort(), [vehicles]);
  const transmissions = useMemo(() => Array.from(new Set(vehicles.map((v) => v.transmission))).sort(), [vehicles]);
  const bodyTypes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.bodyType))).sort(), [vehicles]);
  const colors = useMemo(() => Array.from(new Set(vehicles.map((v) => v.color))).sort(), [vehicles]);
  const engines = useMemo(() => Array.from(new Set(vehicles.map((v) => v.engine.split(' ')[0]))).sort(), [vehicles]);

  // Simulación de Carga Progresiva con debounce
  const triggerProgressiveLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 240);
    return () => clearTimeout(timer);
  };

  // Sincronización de URLs Amigables (Query Params en el Navegador)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedMake) params.set('marca', selectedMake);
    if (selectedModel) params.set('modelo', selectedModel);
    if (selectedBodyType) params.set('carroceria', selectedBodyType);
    if (selectedFuel) params.set('combustible', selectedFuel);
    if (minPrice > 0) params.set('precio_min', minPrice.toString());
    if (maxPrice < 60000) params.set('precio_max', maxPrice.toString());
    if (minYear > 2017) params.set('anio_min', minYear.toString());
    if (selectedCity) params.set('ciudad', selectedCity);
    if (onlyPremium) params.set('premium', '1');
    if (onlyCertified) params.set('certificados', '1');

    const newRelativePathQuery = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState(null, '', newRelativePathQuery);

    triggerProgressiveLoading();
    setCurrentPage(1); // Reiniciar a página 1 con cada cambio de filtro
  }, [
    searchQuery,
    selectedMake,
    selectedModel,
    selectedVersion,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    maxMileage,
    selectedCity,
    selectedDepartment,
    selectedFuel,
    selectedTransmission,
    selectedBodyType,
    selectedColor,
    onlyFinanciable,
    onlyNegociable,
    onlyPremium,
    onlyDestacado,
    onlyCertified,
    sortBy,
  ]);

  // Filtrado y Ordenamiento
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (v.status !== 'publicado') return false;

        // Búsqueda general por texto
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = v.title.toLowerCase().includes(q);
          const matchMake = v.make.toLowerCase().includes(q);
          const matchModel = v.model.toLowerCase().includes(q);
          const matchVersion = v.version.toLowerCase().includes(q);
          if (!matchTitle && !matchMake && !matchModel && !matchVersion) return false;
        }

        // Filtros exactos
        if (selectedMake && v.make !== selectedMake) return false;
        if (selectedModel && v.model !== selectedModel) return false;
        if (selectedVersion && v.version !== selectedVersion) return false;
        if (v.priceUsd < minPrice || v.priceUsd > maxPrice) return false;
        if (v.year < minYear || v.year > maxYear) return false;
        if (v.mileageKm > maxMileage) return false;
        if (selectedCity && v.city !== selectedCity) return false;
        if (selectedDepartment && v.region !== selectedDepartment) return false;
        if (selectedFuel && v.fuelType !== selectedFuel) return false;
        if (selectedTransmission && v.transmission !== selectedTransmission) return false;
        if (selectedBodyType && v.bodyType !== selectedBodyType) return false;
        if (selectedColor && !v.color.toLowerCase().includes(selectedColor.toLowerCase())) return false;
        if (selectedEngine && !v.engine.includes(selectedEngine)) return false;

        // Toggles comerciales
        if (onlyCertified && (v.inspectionScore || 0) < 90) return false;
        if (onlyPremium && v.plan !== 'premium') return false;
        if (onlyDestacado && v.plan !== 'destacado' && v.plan !== 'premium') return false;
        if (onlyFinanciable && v.priceUsd < 15000) return false; // Regla de crédito: >= $15,000 USD
        if (onlyNegociable && v.plan === 'free') return false; // Publicaciones destacadas admiten oferta directa

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'relevance') {
          // Ponderación: Premium = 3, Destacado = 2, Free = 1; y desempate por Score de Inspección
          const weight = { premium: 3, destacado: 2, free: 1 };
          const planDiff = (weight[b.plan] || 0) - (weight[a.plan] || 0);
          if (planDiff !== 0) return planDiff;
          return (b.inspectionScore || 0) - (a.inspectionScore || 0);
        }
        if (sortBy === 'price_asc') return a.priceUsd - b.priceUsd;
        if (sortBy === 'price_desc') return b.priceUsd - a.priceUsd;
        if (sortBy === 'year_desc') return b.year - a.year;
        if (sortBy === 'mileage_asc') return a.mileageKm - b.mileageKm;
        return 0;
      });
  }, [
    vehicles,
    searchQuery,
    selectedMake,
    selectedModel,
    selectedVersion,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    maxMileage,
    selectedCity,
    selectedDepartment,
    selectedFuel,
    selectedTransmission,
    selectedBodyType,
    selectedColor,
    selectedEngine,
    onlyFinanciable,
    onlyNegociable,
    onlyPremium,
    onlyDestacado,
    onlyCertified,
    sortBy,
  ]);

  // Paginación Matemática
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMake('');
    setSelectedModel('');
    setSelectedVersion('');
    setMinPrice(0);
    setMaxPrice(60000);
    setMinYear(2017);
    setMaxYear(2024);
    setMaxMileage(120000);
    setSelectedCity('');
    setSelectedDepartment('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setSelectedBodyType('');
    setSelectedColor('');
    setSelectedEngine('');
    setOnlyFinanciable(false);
    setOnlyNegociable(false);
    setOnlyPremium(false);
    setOnlyDestacado(false);
    setOnlyCertified(false);
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedMake ||
    selectedModel ||
    selectedVersion ||
    minPrice > 0 ||
    maxPrice < 60000 ||
    minYear > 2017 ||
    maxYear < 2024 ||
    maxMileage < 120000 ||
    selectedCity ||
    selectedDepartment ||
    selectedFuel ||
    selectedTransmission ||
    selectedBodyType ||
    selectedColor ||
    selectedEngine ||
    onlyFinanciable ||
    onlyNegociable ||
    onlyPremium ||
    onlyDestacado ||
    onlyCertified;

  // Inyección de Datos Estructurados Schema.org JSON-LD para SEO
  const jsonLdData = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: paginatedVehicles.map((veh, idx) => ({
        '@type': 'Car',
        position: idx + 1,
        name: veh.title,
        brand: { '@type': 'Brand', name: veh.make },
        model: veh.model,
        vehicleModelDate: veh.year,
        mileageFromOdometer: {
          '@type': 'QuantitativeValue',
          value: veh.mileageKm,
          unitCode: 'KMT',
        },
        offers: {
          '@type': 'Offer',
          price: veh.priceUsd,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      })),
    };
  }, [paginatedVehicles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Script SEO JSON-LD Inyectado Dinámicamente */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* CABECERA PRINCIPAL CON METRIC STRIP Y BUSCADOR RÁPIDO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            Catálogo Público de Vehículos
            {onlyCertified && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-sans">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Certificados
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Filtra con precisión milimétrica entre {vehicles.length} unidades disponibles con historial mecánico y legal saneado
          </p>
        </div>

        {/* Buscador Full-Text con Clear Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo o versión..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Botón Filtros Móvil */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg text-slate-700 flex items-center gap-1 text-xs shrink-0 cursor-pointer shadow-xs"
          >
            <Filter className="w-4 h-4 text-amber-600" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </div>

      {/* CHIPS DE FILTROS ACTIVOS (DISCARDABLES) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-amber-600" /> Filtros Activos:
          </span>

          {selectedMake && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-md text-amber-900 font-medium">
              Marca: {selectedMake}
              <button onClick={() => setSelectedMake('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedModel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-md text-amber-900 font-medium">
              Modelo: {selectedModel}
              <button onClick={() => setSelectedModel('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBodyType && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-md text-amber-900 font-medium">
              Carrocería: {selectedBodyType}
              <button onClick={() => setSelectedBodyType('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedFuel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-md text-amber-900 font-medium">
              Combustible: {selectedFuel}
              <button onClick={() => setSelectedFuel('')} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {onlyCertified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded-md text-emerald-900 font-medium">
              Solo Certificados
              <button onClick={() => setOnlyCertified(false)} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {onlyPremium && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-200 border border-amber-400 rounded-md text-slate-900 font-semibold">
              Solo Premium Oro
              <button onClick={() => setOnlyPremium(false)} className="hover:text-rose-600 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="ml-auto text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer text-xs"
          >
            Limpiar Todos los Filtros
          </button>
        </div>
      )}

      {/* LAYOUT PRINCIPAL: 2 COLUMNAS (SIDEBAR DE FILTROS + GRID DE RESULTADOS) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* COLUMNA 1: FILTROS LATERALES FACETADOS COMPLETOS (DESKTOP) */}
        <aside className="hidden lg:block bg-white border border-slate-200 rounded-2xl p-5 space-y-5 sticky top-20 shadow-xs max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              Filtros Avanzados
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Restablecer
              </button>
            )}
          </div>

          {/* Filtro: Marca */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Marca</label>
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel('');
                setSelectedVersion('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Todas las marcas</option>
              {makes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Modelo (Dependiente) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo</label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedVersion('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Todos los modelos</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Versión */}
          {versions.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Versión</label>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="">Todas las versiones</option>
                {versions.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}

          {/* Rango de Precios (Mínimo / Máximo) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-semibold">Precio (USD)</span>
              <span className="font-mono tabular-nums text-slate-900 font-semibold">
                ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Mín: 0"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
              <input
                type="number"
                placeholder="Máx: 60000"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(Number(e.target.value) || 60000)}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <input
              type="range"
              min={10000}
              max={60000}
              step={2000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Rango de Años */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-semibold">Año Modelo</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">{minYear} - {maxYear}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={2010}
                max={2024}
                value={minYear}
                onChange={(e) => setMinYear(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
              <input
                type="number"
                min={2010}
                max={2024}
                value={maxYear}
                onChange={(e) => setMaxYear(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          {/* Kilometraje Máximo */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-semibold">Kilometraje Máximo</span>
              <span className="font-mono tabular-nums font-semibold text-slate-900">{maxMileage.toLocaleString('es-CL')} km</span>
            </div>
            <input
              type="range"
              min={10000}
              max={150000}
              step={5000}
              value={maxMileage}
              onChange={(e) => setMaxMileage(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Ubicación: Ciudad y Departamento */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ciudad</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
              >
                <option value="">Todas</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Departamento</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
              >
                <option value="">Todos</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Atributos Técnicos: Combustible, Transmisión, Carrocería, Color */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Combustible</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
              >
                <option value="">Cualquier combustible</option>
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Transmisión</label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
              >
                <option value="">Cualquier transmisión</option>
                {transmissions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Carrocería</label>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs cursor-pointer"
              >
                <option value="">Cualquier carrocería</option>
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggles Comerciales Requeridos */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyCertified}
                onChange={(e) => setOnlyCertified(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300"
              />
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Solo Certificados (90+)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyFinanciable}
                onChange={(e) => setOnlyFinanciable(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300"
              />
              <span className="flex items-center gap-1 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-600" /> Financiable en cuotas
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyNegociable}
                onChange={(e) => setOnlyNegociable(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300"
              />
              <span className="flex items-center gap-1 font-medium">
                <DollarSign className="w-3.5 h-3.5 text-slate-600" /> Acepta Oferta / Negociable
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyPremium}
                onChange={(e) => setOnlyPremium(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300"
              />
              <span className="flex items-center gap-1 font-semibold text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Solo Plan Premium Oro
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={onlyDestacado}
                onChange={(e) => setOnlyDestacado(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-slate-300"
              />
              <span className="font-medium">Solo Avisos Destacados</span>
            </label>
          </div>
        </aside>

        {/* COLUMNA 2: RESULTADOS, CARDS, CARGA PROGRESIVA Y PAGINACIÓN */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* BARRA SUPERIOR DE ORDENAMIENTO Y VISTAS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-xs">
            <div className="text-slate-600">
              Mostrando <span className="font-semibold text-slate-900 font-mono tabular-nums">{filteredVehicles.length}</span> vehículos encontrados
              {filteredVehicles.length > 0 && (
                <span className="text-slate-400 ml-1">
                  (Página {currentPage} de {totalPages})
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="relevance">Relevancia / Destacados</option>
                  <option value="price_asc">Menor precio</option>
                  <option value="price_desc">Mayor precio</option>
                  <option value="year_desc">Año más reciente</option>
                  <option value="mileage_asc">Menor kilometraje</option>
                </select>
              </div>

              {/* Toggle Grid vs Lista */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded cursor-pointer ${
                    viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Vista Lista"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* CARGA PROGRESIVA (SKELETON LOADERS) */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="pt-3 border-t border-slate-100 flex justify-between">
                      <div className="h-5 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            /* ESTADO VACÍO */
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-semibold text-slate-800 text-sm">No encontramos vehículos con esta combinación</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Prueba relajando algunos de los filtros seleccionados para ampliar los resultados disponibles.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* VISTA GRID DE CARDS 4:3 */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => onSelectVehicle(vehicle)}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.title}
                      className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-mono font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{vehicle.inspectionScore}/100</span>
                    </div>

                    {vehicle.plan === 'premium' && (
                      <span className="absolute bottom-2.5 left-2.5 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        Premium Oro
                      </span>
                    )}

                    {/* Botones Flotantes: Favorito y Comparador */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(vehicle);
                        }}
                        className={`p-1.5 rounded-md backdrop-blur-sm transition-colors cursor-pointer ${
                          isVehicleCompared(vehicle.id)
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-900/60 hover:bg-slate-900/90 text-white'
                        }`}
                        title={isVehicleCompared(vehicle.id) ? 'Remover del comparador' : 'Agregar al comparador'}
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => toggleFavorite(e, vehicle.id)}
                        className={`p-1.5 rounded-md backdrop-blur-sm transition-colors cursor-pointer ${
                          favorites.includes(vehicle.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/60 hover:bg-slate-900/90 text-white'
                        }`}
                        title="Guardar en favoritos"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        <span>{vehicle.make} · {vehicle.model}</span>
                        <span>{vehicle.city}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm mt-0.5 line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {vehicle.title}
                      </h3>
                      <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                        <span className="font-mono tabular-nums">{vehicle.year}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{vehicle.mileageKm.toLocaleString('es-CL')} km</span>
                        <span>·</span>
                        <span>{vehicle.fuelType}</span>
                        <span>·</span>
                        <span>{vehicle.transmission}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Precio al contado</span>
                        <span className="font-display font-bold text-lg text-slate-900 font-mono tabular-nums">
                          ${vehicle.priceUsd.toLocaleString('en-US')} <span className="text-[11px] font-normal text-slate-500">USD</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Desde</span>
                        <span className="text-xs font-semibold text-amber-700 font-mono tabular-nums">
                          ${Math.round(vehicle.priceUsd * 0.016)}/mes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VISTA LISTA HORIZONTAL */
            <div className="space-y-3">
              {paginatedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => onSelectVehicle(vehicle)}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col sm:flex-row"
                >
                  <div className="sm:w-64 aspect-[4/3] sm:aspect-auto bg-slate-950 relative shrink-0 flex items-center justify-center">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.title}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-mono font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{vehicle.inspectionScore}/100</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        <span>{vehicle.make} · {vehicle.model}</span>
                        <span>{vehicle.city}, {vehicle.region}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-base mt-0.5 group-hover:text-amber-600 transition-colors">
                        {vehicle.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {vehicle.description}
                      </p>
                      <div className="text-xs text-slate-600 mt-2 flex flex-wrap items-center gap-2">
                        <span className="font-mono tabular-nums">{vehicle.year}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{vehicle.mileageKm.toLocaleString('es-CL')} km</span>
                        <span>·</span>
                        <span>{vehicle.fuelType}</span>
                        <span>·</span>
                        <span>{vehicle.transmission}</span>
                        <span>·</span>
                        <span>{vehicle.engine} ({vehicle.horsepower} HP)</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Precio contado</span>
                        <span className="font-display font-bold text-xl text-slate-900 font-mono tabular-nums">
                          ${vehicle.priceUsd.toLocaleString('en-US')} <span className="text-xs font-normal text-slate-500">USD</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(vehicle);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                            isVehicleCompared(vehicle.id)
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{isVehicleCompared(vehicle.id) ? 'En Comparación' : 'Comparar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINACIÓN NUMÉRICA Y NAVEGACIÓN */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-xs text-xs">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-amber-600 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                Siguiente <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* DRAWER LATERAL DE FILTROS EN DISPOSITIVOS MÓVILES */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-display font-bold text-sm text-slate-900">Filtros de Catálogo</span>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector Marca */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marca</label>
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              >
                <option value="">Todas</option>
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Selector Carrocería */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Carrocería</label>
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
              >
                <option value="">Todas</option>
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full py-2.5 bg-amber-600 text-white font-semibold rounded-lg text-xs"
            >
              Aplicar y Ver ({filteredVehicles.length}) Resultados
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
