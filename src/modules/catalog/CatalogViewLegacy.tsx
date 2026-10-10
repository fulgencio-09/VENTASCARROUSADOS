/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Catálogo público AutoMarket Pro.
 * Regla financiera: todos los precios están en pesos colombianos (COP).
 */

import React, { useMemo, useState } from 'react';
import { Vehicle } from '../../types/marketplace';
import { Search, SlidersHorizontal, LayoutGrid, List, ShieldCheck, RotateCcw, Scale, Heart, X, Sparkles, Zap, CheckCircle2, ChevronLeft, ChevronRight, Filter, Tag } from 'lucide-react';
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

const MAX_PRICE_COP = 250_000_000;
const formatCop = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

export const CatalogView: React.FC<CatalogViewProps> = ({ vehicles, onSelectVehicle, onToggleCompare, comparisonList, initialFilters = {}, favorites: externalFavorites, onToggleFavorite, onRequireAuth }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState(String(initialFilters.make || ''));
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState(String(initialFilters.bodyType || ''));
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number(initialFilters.maxPrice || MAX_PRICE_COP));
  const [minYear, setMinYear] = useState(2017);
  const [maxYear, setMaxYear] = useState(2026);
  const [maxMileage, setMaxMileage] = useState(150000);
  const [onlyFinanciable, setOnlyFinanciable] = useState(false);
  const [onlyNegociable, setOnlyNegociable] = useState(false);
  const [onlyPremium, setOnlyPremium] = useState(false);
  const [onlyDestacado, setOnlyDestacado] = useState(false);
  const [onlyCertified, setOnlyCertified] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const itemsPerPage = 6;

  const [localFavorites, setLocalFavorites] = useState<string[]>(() => {
    try { const saved = localStorage.getItem('automarket_user_favorites'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const favorites = externalFavorites || localFavorites;

  const makes = useMemo(() => Array.from(new Set(vehicles.map(v => v.make))).sort(), [vehicles]);
  const models = useMemo(() => Array.from(new Set(vehicles.filter(v => !selectedMake || v.make === selectedMake).map(v => v.model))).sort(), [vehicles, selectedMake]);
  const bodyTypes = useMemo(() => Array.from(new Set(vehicles.map(v => v.bodyType))).sort(), [vehicles]);
  const fuelTypes = useMemo(() => Array.from(new Set(vehicles.map(v => v.fuelType))).sort(), [vehicles]);
  const transmissions = useMemo(() => Array.from(new Set(vehicles.map(v => v.transmission))).sort(), [vehicles]);
  const cities = useMemo(() => Array.from(new Set(vehicles.map(v => v.city))).sort(), [vehicles]);
  const colors = useMemo(() => Array.from(new Set(vehicles.map(v => v.color))).sort(), [vehicles]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const session = AuthStateManager.getInstance().getSession();
    const callback = () => {
      if (onToggleFavorite) onToggleFavorite(id);
      else setLocalFavorites(prev => { const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]; localStorage.setItem('automarket_user_favorites', JSON.stringify(next)); return next; });
    };
    if (!session.isAuthenticated || session.user?.role === 'visitante') { onRequireAuth?.('guardar este vehículo en tus favoritos', callback); return; }
    callback();
  };

  const resetFilters = () => {
    setSearchQuery(''); setSelectedMake(''); setSelectedModel(''); setSelectedBodyType(''); setSelectedFuel(''); setSelectedTransmission(''); setSelectedCity(''); setSelectedColor('');
    setMinPrice(0); setMaxPrice(MAX_PRICE_COP); setMinYear(2017); setMaxYear(2026); setMaxMileage(150000);
    setOnlyFinanciable(false); setOnlyNegociable(false); setOnlyPremium(false); setOnlyDestacado(false); setOnlyCertified(false); setSortBy('relevance'); setCurrentPage(1);
  };

  const filteredVehicles = useMemo(() => vehicles.filter(v => {
    const price = v.priceCop ?? 0;
    if (v.status !== 'publicado') return false;
    const q = searchQuery.trim().toLowerCase();
    if (q && ![v.title, v.make, v.model, v.version].some(x => x.toLowerCase().includes(q))) return false;
    if (selectedMake && v.make !== selectedMake) return false;
    if (selectedModel && v.model !== selectedModel) return false;
    if (selectedBodyType && v.bodyType !== selectedBodyType) return false;
    if (selectedFuel && v.fuelType !== selectedFuel) return false;
    if (selectedTransmission && v.transmission !== selectedTransmission) return false;
    if (selectedCity && v.city !== selectedCity) return false;
    if (selectedColor && !v.color.toLowerCase().includes(selectedColor.toLowerCase())) return false;
    if (price < minPrice || price > maxPrice) return false;
    if (v.year < minYear || v.year > maxYear) return false;
    if (v.mileageKm > maxMileage) return false;
    if (onlyCertified && (v.inspectionScore || 0) < 90) return false;
    if (onlyPremium && v.plan !== 'premium') return false;
    if (onlyDestacado && !['destacado', 'premium'].includes(v.plan)) return false;
    if (onlyFinanciable && price < 60_000_000) return false;
    if (onlyNegociable && v.plan === 'free') return false;
    return true;
  }).sort((a, b) => {
    const pa = a.priceCop ?? 0, pb = b.priceCop ?? 0;
    if (sortBy === 'price_asc') return pa - pb;
    if (sortBy === 'price_desc') return pb - pa;
    if (sortBy === 'year_desc') return b.year - a.year;
    if (sortBy === 'mileage_asc') return a.mileageKm - b.mileageKm;
    const weight = { premium: 3, destacado: 2, free: 1 };
    return (weight[b.plan] || 0) - (weight[a.plan] || 0) || (b.inspectionScore || 0) - (a.inspectionScore || 0);
  }), [vehicles, searchQuery, selectedMake, selectedModel, selectedBodyType, selectedFuel, selectedTransmission, selectedCity, selectedColor, minPrice, maxPrice, minYear, maxYear, maxMileage, onlyCertified, onlyPremium, onlyDestacado, onlyFinanciable, onlyNegociable, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / itemsPerPage));
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const hasFilters = !!(searchQuery || selectedMake || selectedModel || selectedBodyType || selectedFuel || selectedTransmission || selectedCity || selectedColor || minPrice || maxPrice !== MAX_PRICE_COP || minYear !== 2017 || maxYear !== 2026 || maxMileage !== 150000 || onlyCertified || onlyPremium || onlyDestacado || onlyFinanciable || onlyNegociable);

  const Filters = () => <div className="space-y-4">
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Marca</label><select value={selectedMake} onChange={e => { setSelectedMake(e.target.value); setSelectedModel(''); }} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"><option value="">Todas las marcas</option>{makes.map(m => <option key={m}>{m}</option>)}</select></div>
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Modelo</label><select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"><option value="">Todos los modelos</option>{models.map(m => <option key={m}>{m}</option>)}</select></div>
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Carrocería</label><select value={selectedBodyType} onChange={e => setSelectedBodyType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"><option value="">Todas</option>{bodyTypes.map(x => <option key={x}>{x}</option>)}</select></div>
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Combustible</label><select value={selectedFuel} onChange={e => setSelectedFuel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"><option value="">Todos</option>{fuelTypes.map(x => <option key={x}>{x}</option>)}</select></div>
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Transmisión</label><select value={selectedTransmission} onChange={e => setSelectedTransmission(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"><option value="">Todas</option>{transmissions.map(x => <option key={x}>{x}</option>)}</select></div>
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Ciudad</label><select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"><option value="">Todas</option>{cities.map(x => <option key={x}>{x}</option>)}</select></div>
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Precio en COP</label><div className="grid grid-cols-2 gap-2"><input type="number" min="0" value={minPrice || ''} placeholder="Mínimo" onChange={e => setMinPrice(Number(e.target.value) || 0)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"/><input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value) || MAX_PRICE_COP)} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"/></div><input type="range" min={0} max={MAX_PRICE_COP} step={5_000_000} value={Math.min(maxPrice, MAX_PRICE_COP)} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full mt-2 accent-amber-600"/><p className="text-[11px] text-slate-500 mt-1">Hasta {formatCop(maxPrice)}</p></div>
    <div><label className="block text-xs font-semibold text-slate-700 mb-1">Kilometraje máximo</label><input type="range" min={0} max={200000} step={5000} value={maxMileage} onChange={e => setMaxMileage(Number(e.target.value))} className="w-full accent-amber-600"/><p className="text-[11px] text-slate-500">{maxMileage.toLocaleString('es-CO')} km</p></div>
    <div className="space-y-2 border-t pt-3">{[[onlyCertified, setOnlyCertified, 'Solo certificados'], [onlyFinanciable, setOnlyFinanciable, 'Financiable'], [onlyNegociable, setOnlyNegociable, 'Acepta oferta'], [onlyPremium, setOnlyPremium, 'Solo Premium Oro'], [onlyDestacado, setOnlyDestacado, 'Solo destacados']].map(([value, setter, label]) => <label key={String(label)} className="flex items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={Boolean(value)} onChange={e => (setter as React.Dispatch<React.SetStateAction<boolean>>)(e.target.checked)} />{String(label)}</label>)}</div>
    {hasFilters && <button onClick={resetFilters} className="w-full text-xs font-semibold text-amber-700 flex items-center justify-center gap-1"><RotateCcw size={14}/>Restablecer filtros</button>}
  </div>;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5"><div><h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2"><Tag className="w-6 h-6 text-amber-600"/>Catálogo Público de Vehículos</h1><p className="text-xs text-slate-500 mt-1">Precios expresados exclusivamente en pesos colombianos (COP).</p></div><div className="relative w-full md:w-80"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/><input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Buscar marca, modelo o versión..." className="w-full pl-9 pr-3 py-2 border rounded-lg text-xs"/></div></div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8"><aside className="hidden lg:block bg-white border rounded-2xl p-5 sticky top-20"><div className="flex items-center gap-2 mb-4 font-semibold text-sm"><SlidersHorizontal size={16}/>Filtros avanzados</div><Filters/></aside><main className="lg:col-span-3 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border text-xs"><span className="text-slate-600">{filteredVehicles.length} vehículos encontrados</span><div className="flex items-center gap-2"><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-50 border rounded-lg px-2 py-1.5"><option value="relevance">Relevancia</option><option value="price_asc">Menor precio</option><option value="price_desc">Mayor precio</option><option value="year_desc">Año más reciente</option><option value="mileage_asc">Menor kilometraje</option></select><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}><LayoutGrid size={16}/></button><button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}><List size={16}/></button><button onClick={() => setMobileDrawerOpen(true)} className="lg:hidden p-1.5 bg-slate-100 rounded"><Filter size={16}/></button></div></div>
      {viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{paginatedVehicles.map(vehicle => <article key={vehicle.id} onClick={() => onSelectVehicle(vehicle)} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"><div className="relative aspect-[4/3] bg-slate-950"><img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full object-contain"/><span className="absolute top-2 left-2 bg-slate-900/85 text-white px-2 py-1 rounded text-[11px] flex items-center gap-1"><ShieldCheck size={13}/>{vehicle.inspectionScore}/100</span><div className="absolute top-2 right-2 flex gap-1"><button onClick={e => { e.stopPropagation(); onToggleCompare(vehicle); }} className="p-1.5 bg-slate-900/70 text-white rounded"><Scale size={14}/></button><button onClick={e => toggleFavorite(e, vehicle.id)} className={`p-1.5 rounded ${favorites.includes(vehicle.id) ? 'bg-rose-500 text-white' : 'bg-slate-900/70 text-white'}`}><Heart size={14} fill="currentColor"/></button></div></div><div className="p-4 space-y-3"><div className="text-[11px] text-slate-400 uppercase">{vehicle.make} · {vehicle.model} · {vehicle.city}</div><h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{vehicle.title}</h3><div className="text-xs text-slate-500">{vehicle.year} · {vehicle.mileageKm.toLocaleString('es-CO')} km · {vehicle.fuelType} · {vehicle.transmission}</div><div className="pt-3 border-t flex items-end justify-between"><div><span className="text-[11px] text-slate-400 block">Precio al contado</span><span className="font-display font-bold text-lg text-slate-900">{formatCop(vehicle.priceCop ?? 0)}</span></div>{vehicle.plan !== 'free' && <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1"><Sparkles size={12}/>Destacado</span>}</div></div></article>)}</div> : <div className="space-y-3">{paginatedVehicles.map(vehicle => <article key={vehicle.id} onClick={() => onSelectVehicle(vehicle)} className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4 cursor-pointer"><img src={vehicle.images[0]} alt={vehicle.title} className="sm:w-56 aspect-[4/3] object-cover rounded-lg bg-slate-900"/><div className="flex-1"><div className="text-xs text-slate-500">{vehicle.make} · {vehicle.model} · {vehicle.city}</div><h3 className="font-semibold text-slate-900 mt-1">{vehicle.title}</h3><p className="text-xs text-slate-500 mt-1 line-clamp-2">{vehicle.description}</p><div className="mt-3 font-bold text-xl">{formatCop(vehicle.priceCop ?? 0)}</div></div></article>)}</div>}
      {totalPages > 1 && <div className="flex items-center justify-between bg-white border px-4 py-3 rounded-xl"><button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border rounded-lg disabled:opacity-30"><ChevronLeft size={15}/></button><span className="text-xs text-slate-500">Página {currentPage} de {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border rounded-lg disabled:opacity-30"><ChevronRight size={15}/></button></div>}
    </main></div>
    {mobileDrawerOpen && <div className="fixed inset-0 z-60 bg-black/60 flex justify-end"><div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto"><div className="flex justify-between mb-5"><h2 className="font-bold">Filtros</h2><button onClick={() => setMobileDrawerOpen(false)}><X/></button></div><Filters/></div></div>}
  </div>;
};
