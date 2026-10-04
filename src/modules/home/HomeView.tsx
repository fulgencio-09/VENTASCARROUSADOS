/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Vista Home: Hero con buscador facetado rápido, categorías de carrocería, destacados y garantías
 */

import React, { useState } from 'react';
import { Vehicle } from '../../types/marketplace';
import { Search, ShieldCheck, Award, FileCheck2, ArrowRight, Zap, Check, ChevronRight } from 'lucide-react';
import sedanHero from '../../assets/images/sedan_luxury_car_1791075158268.jpg';

interface HomeViewProps {
  featuredVehicles: Vehicle[];
  onSelectVehicle: (v: Vehicle) => void;
  onNavigateToCatalog: (filters?: Record<string, string | number>) => void;
  onOpenPublish: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  featuredVehicles,
  onSelectVehicle,
  onNavigateToCatalog,
  onOpenPublish,
}) => {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const makes = ['BMW', 'Toyota', 'Ford', 'Mazda', 'Audi', 'Mercedes-Benz', 'Volkswagen'];
  const bodyTypes = [
    { label: 'SUV', count: '480+' },
    { label: 'Sedán', count: '390+' },
    { label: 'Pick-up', count: '210+' },
    { label: 'Hatchback', count: '185+' },
    { label: 'Híbrido', count: '140+' },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query: Record<string, string | number> = {};
    if (selectedMake) query.make = selectedMake;
    if (selectedBodyType) query.bodyType = selectedBodyType;
    if (maxPrice) query.maxPrice = Number(maxPrice);
    onNavigateToCatalog(query);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION: Fotografía real con contrast scrim y buscador facetado rápido */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Imagen de fondo con opacidad y gradiente medido */}
        <div className="absolute inset-0 z-0">
          <img
            src={sedanHero}
            alt="Vehículo de alta gama en showroom"
            className="w-full h-full object-cover object-center opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              Seminuevos Certificados con Inspección de 150 Puntos
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
              Compra y vende tu auto con total certeza mecánica y legal.
            </h1>
            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              Plataforma líder para vehículos usados verificados por concesionarias oficiales y vendedores certificados. Sin intermediarios dudosos.
            </p>

            {/* Módulo buscador rápido en 1 fila */}
            <form
              onSubmit={handleQuickSearch}
              className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20 text-slate-900 grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-8"
            >
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase px-2 mb-1">Marca</label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="">Todas las marcas</option>
                  {makes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase px-2 mb-1">Carrocería</label>
                <select
                  value={selectedBodyType}
                  onChange={(e) => setSelectedBodyType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="">Cualquier tipo</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedán">Sedán</option>
                  <option value="Pick-up">Pick-up</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase px-2 mb-1">Precio Máximo (USD)</label>
                <input
                  type="number"
                  placeholder="Ej: 35000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Explorar Autos</span>
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> +1.400 unidades activas
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Saneamiento legal asegurado
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Crédito y financiamiento en línea
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTROS RÁPIDOS POR TIPO DE CARROCERÍA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
              Explora por Tipo de Vehículo
            </h2>
            <p className="text-xs text-slate-500 mt-1">Selecciona la categoría adecuada para tus necesidades de conducción</p>
          </div>
          <button
            onClick={() => onNavigateToCatalog()}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            Ver catálogo completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {bodyTypes.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigateToCatalog({ bodyType: item.label })}
              className="bg-white border border-slate-200 hover:border-amber-500 rounded-xl p-4 text-left transition-all hover:shadow-sm group cursor-pointer"
            >
              <span className="font-display font-semibold text-sm text-slate-900 group-hover:text-amber-600 block">
                {item.label}
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">{item.count} disponibles</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. VEHÍCULOS DESTACADOS CON SCORE DE INSPECCIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
              Vehículos Destacados y Certificados
            </h2>
            <p className="text-xs text-slate-500 mt-1">Unidades con informe mecánico exhaustivo y garantía de kilometraje real</p>
          </div>
          <button
            onClick={() => onNavigateToCatalog()}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            Ver todos ({featuredVehicles.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.slice(0, 6).map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle)}
              className="bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col"
            >
              {/* Contenedor de Imagen 4:3 con Badge de Inspección */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Certificado {vehicle.inspectionScore}/100</span>
                </div>
                {vehicle.plan === 'premium' && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                    Premium
                  </div>
                )}
              </div>

              {/* Contenido de la Card sin Píldoras Estáticas */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {vehicle.make} · {vehicle.model}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base mt-0.5 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {vehicle.title}
                  </h3>
                  
                  {/* Metadatos en texto unboxed con separadores tipográficos */}
                  <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                    <span className="font-mono tabular-nums">{vehicle.year}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{vehicle.mileageKm.toLocaleString('es-CL')} km</span>
                    <span aria-hidden="true">·</span>
                    <span>{vehicle.fuelType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Precio al contado</span>
                    <span className="font-display font-bold text-xl text-slate-900 font-mono tabular-nums">
                      ${vehicle.priceUsd.toLocaleString('en-US')} <span className="text-xs font-normal text-slate-500">USD</span>
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
      </section>

      {/* 4. PILARES DE CONFIANZA Y GARANTÍAS DEL MARKETPLACE */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Inspección de 150 Puntos</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada vehículo con informe detallado sobre salud de motor, compresión, espesor de pintura original, frenos y neumáticos.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Historial Legal Saneado</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verificación de prendas vigentes, multas impagas, revisión técnica oficial y kilometraje cronológico sin alteraciones.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Financiamiento Instantáneo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simula tu crédito en segundos con tasa preferencial y solicita evaluación en línea con respuesta en menos de 2 horas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION PARA VENDEDORES Y CONCESIONARIAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Vende con Respaldo Profesional
            </span>
            <h3 className="font-display font-bold text-2xl text-slate-900">
              ¿Quieres vender tu vehículo o eres una concesionaria?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Publica hoy mismo con alcance a miles de compradores calificados. Gestión de leads directa, botón de WhatsApp y certificación técnica para acelerar tu venta.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenPublish}
              className="px-6 py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Comenzar Publicación</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
