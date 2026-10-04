/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Vista Suite 17 Prompts: Banco de Especificación Técnica con Reglas de Continuidad Acumulativa
 */

import React, { useState } from 'react';
import { SYSTEM_PROMPTS } from '../../data/promptsData';
import {
  Layers,
  Copy,
  Check,
  ShieldCheck,
  FileCode,
  Link,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const PromptsSuiteView: React.FC = () => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const currentPrompt = SYSTEM_PROMPTS[selectedPromptIndex];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt.promptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(currentPrompt.codeArtifactSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* CABECERA DE LA SUITE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-7 h-7 text-amber-600" />
              Suite Maestra de los 17 Prompts Encadenados
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Especificación técnica secuencial para el desarrollo del Marketplace de Vehículos Usados. Cada prompt exige a la IA respetar rigurosamente lo construido anteriormente.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs text-amber-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Principio de No Regresión Arquitectónica Activo</span>
        </div>
      </div>

      {/* REJILLA DE NAVEGACIÓN ENTRE LOS 17 PROMPTS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        {SYSTEM_PROMPTS.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setSelectedPromptIndex(idx)}
            className={`p-2 rounded-lg text-left transition-all cursor-pointer ${
              selectedPromptIndex === idx
                ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span className="text-[10px] font-mono block text-amber-600 font-bold">P{p.number}</span>
            <span className="text-xs truncate block">{p.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* CONTENIDO DEL PROMPT SELECCIONADO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* PANEL IZQUIERDO: DETALLE DEL PROMPT (8 COLS) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-6 p-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
                PROMPT {currentPrompt.number} · {currentPrompt.phase}
              </span>
              <h2 className="font-display font-bold text-xl text-slate-900 mt-2">
                {currentPrompt.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{currentPrompt.scopeSummary}</p>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Prompt Copiado!' : 'Copiar Prompt'}</span>
            </button>
          </div>

          {/* CLÁUSULA DE CONTINUIDAD CRÍTICA (HIGHLIGHTED) */}
          <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Regla de Continuidad Acumulativa Obligatoria:
            </span>
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              {currentPrompt.strictContinuityClause}
            </p>
          </div>

          {/* TEXTO COMPLETO DEL PROMPT */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Contenido Completo del Prompt para la IA:
            </label>
            <div className="relative">
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[420px]">
                {currentPrompt.promptContent}
              </pre>
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: ARTEFACTO DE CÓDIGO Y DEPENDENCIAS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Artefacto Técnico */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-900 font-mono">
                  {currentPrompt.codeArtifactName}
                </span>
              </div>
              <button
                onClick={handleCopySnippet}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
                title="Copiar código del artefacto"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-amber-300 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-72">
              {currentPrompt.codeArtifactSnippet}
            </pre>
          </div>

          {/* Gráfico de Dependencias Previas */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-slate-500" />
              Prompts Previos Respetados
            </h4>
            {currentPrompt.dependencies.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Prompt fundacional. Establece los cimientos del sistema.
              </p>
            ) : (
              <div className="space-y-1.5">
                {currentPrompt.dependencies.map((dep) => {
                  const depObj = SYSTEM_PROMPTS.find((p) => p.id === dep);
                  return (
                    <div
                      key={dep}
                      className="text-xs bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-700">P{depObj?.number}: {depObj?.title}</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
