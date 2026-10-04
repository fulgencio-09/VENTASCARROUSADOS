/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Pie de página institucional sin clutter técnico ni tickers falsos
 */

import React from 'react';
import { ShieldCheck, CheckCircle2, Car, HelpCircle, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Marca y Propósito */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Car className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                AutoMarket <span className="text-amber-500">Pro</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma profesional para la compra y venta de vehículos usados certificados con inspección rigurosa de 150 puntos.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Transacciones e identidades verificadas</span>
            </div>
          </div>

          {/* Columna 2: Categorías Rápidas */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Vehículos por Carrocería
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">SUVs Seminuevos</li>
              <li className="hover:text-white transition-colors cursor-pointer">Sedanes Ejecutivos</li>
              <li className="hover:text-white transition-colors cursor-pointer">Camionetas Pick-up 4x4</li>
              <li className="hover:text-white transition-colors cursor-pointer">Híbridos y Eléctricos</li>
              <li className="hover:text-white transition-colors cursor-pointer">Hatchbacks Urbanos</li>
            </ul>
          </div>

          {/* Columna 3: Para Vendedores y Concesionarios */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Vendedores & Agencias
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Planes de Publicación</li>
              <li className="hover:text-white transition-colors cursor-pointer">Certificación de Concesionaria KYC</li>
              <li className="hover:text-white transition-colors cursor-pointer">Asistente de Publicación Rápida</li>
              <li className="hover:text-white transition-colors cursor-pointer">Protocolo de Inspección 150 Puntos</li>
            </ul>
          </div>

          {/* Columna 4: Confianza y Soporte */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Atención y Soporte
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+56 2 2840 9000 (Lun a Vie 09:00 - 18:30)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>soporte@automarket.pro</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certificado SSL 256-bit y WAF Cloudflare</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AutoMarket Pro. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Términos de Servicio</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Política de Privacidad</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Seguridad y KYC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
