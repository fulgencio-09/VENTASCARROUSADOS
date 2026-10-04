/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Vista Comparador: Comparación lado a lado de especificaciones, precio e inspección de hasta 3 vehículos
 */

import React from 'react';
import { Vehicle } from '../../types/marketplace';
import { Scale, X, ShieldCheck, Check, Trash2, ArrowRight } from 'lucide-react';

interface ComparisonViewProps {
  vehicles: Vehicle[];
  onRemoveFromCompare: (id: string) => void;
  onClearAll: () => void;
  onSelectVehicle: (v: Vehicle) => void;
  onNavigateToCatalog: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  vehicles,
  onRemoveFromCompare,
  onClearAll,
  onSelectVehicle,
  onNavigateToCatalog,
}) => {
  if (vehicles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <Scale className="w-7 h-7" />
        </div>
        <h2 className="font-display font-bold text-2xl text-slate-900">
          No tienes vehículos para comparar
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Puedes agregar hasta 3 vehículos desde el catálogo haciendo clic en el icono de la balanza en cada tarjeta.
        </p>
        <button
          onClick={onNavigateToCatalog}
          className="mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  const specRows = [
    { label: 'Precio Contado (USD)', render: (v: Vehicle) => `$${v.priceUsd.toLocaleString('en-US')}` },
    { label: 'Puntaje de Inspección', render: (v: Vehicle) => `${v.inspectionScore}/100 Certificado` },
    { label: 'Año / Modelo', render: (v: Vehicle) => v.year },
    { label: 'Kilometraje Odómetro', render: (v: Vehicle) => `${v.mileageKm.toLocaleString('es-CL')} km` },
    { label: 'Combustible', render: (v: Vehicle) => v.fuelType },
    { label: 'Transmisión', render: (v: Vehicle) => v.transmission },
    { label: 'Tracción', render: (v: Vehicle) => v.traction },
    { label: 'Potencia', render: (v: Vehicle) => `${v.horsepower} HP` },
    { label: 'Carrocería / Puertas', render: (v: Vehicle) => `${v.bodyType} (${v.doors}p)` },
    { label: 'Ubicación / Ciudad', render: (v: Vehicle) => v.city },
    { label: 'Vendedor', render: (v: Vehicle) => `${v.seller.name} (${v.seller.type})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-amber-600" />
            Comparador Lado a Lado
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analiza diferencias técnicas, relación precio-calidad e informes mecánicos de tus opciones
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Limpiar Comparador
        </button>
      </div>

      {/* Tabla Comparativa Responsiva */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 w-48 font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                Especificación
              </th>
              {vehicles.map((v) => (
                <th key={v.id} className="p-4 w-64 align-top">
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={v.images[0]} alt={v.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => onRemoveFromCompare(v.id)}
                        className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded cursor-pointer"
                        title="Quitar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">{v.make}</span>
                      <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{v.title}</h4>
                      <div className="font-display font-bold text-lg text-slate-900 font-mono tabular-nums mt-1">
                        ${v.priceUsd.toLocaleString('en-US')} USD
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectVehicle(v)}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Ver Ficha Completa</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {specRows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                <td className="p-4 font-semibold text-slate-600 text-xs">{row.label}</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-4 font-medium text-slate-800 font-mono tabular-nums">
                    {row.render(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
