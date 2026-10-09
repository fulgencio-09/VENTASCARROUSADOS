/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Puente de moneda del catálogo: mantiene el componente existente y normaliza
 * la presentación de precios a pesos colombianos (COP).
 *
 * Los vehículos del catálogo actual son datos mock heredados en USD. Para no
 * romper consumidores existentes, se convierten a COP únicamente en el límite
 * del catálogo. La referencia de compatibilidad usada para estos mocks es
 * 1 USD = 4.000 COP. Los precios reales de negocio deberán venir del backend
 * con amount + currency=COD/COP según el modelo financiero definitivo.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Vehicle } from '../../types/marketplace';
import { CatalogView as LegacyCatalogView } from './CatalogViewLegacy';

const MOCK_USD_TO_COP = 4000;
const MAX_CATALOG_PRICE_COP = 240_000_000;

const formatCop = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const toCop = (vehicle: Vehicle) =>
  vehicle.priceCop ?? Math.round(vehicle.priceUsd * MOCK_USD_TO_COP);

export const CatalogView: React.FC<React.ComponentProps<typeof LegacyCatalogView>> = (props) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const catalogVehicles = useMemo<Vehicle[]>(
    () =>
      props.vehicles.map((vehicle) => ({
        ...vehicle,
        // El componente legacy consume priceUsd. En el límite del catálogo
        // ese campo representa temporalmente el monto COP para conservar
        // filtros, ordenamiento y cálculos existentes sin reescribirlos.
        priceUsd: toCop(vehicle),
        priceCop: toCop(vehicle),
      })),
    [props.vehicles]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const localizeCurrency = () => {
      // Etiquetas explícitas de moneda.
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) textNodes.push(node as Text);

      textNodes.forEach((textNode) => {
        const value = textNode.nodeValue || '';
        if (value.includes('USD')) {
          textNode.nodeValue = value.replaceAll('USD', 'COP');
        }
        if (value.includes('Precio (USD)')) {
          textNode.nodeValue = value.replace('Precio (USD)', 'Precio (COP)');
        }
      });

      // El componente legacy tiene valores por defecto históricos en USD.
      // Los normalizamos visual y funcionalmente al rango COP.
      const priceInputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[type="number"]'));
      priceInputs.forEach((input) => {
        const placeholder = input.getAttribute('placeholder') || '';
        const isPriceInput = /Mín:|Máx:/.test(placeholder);
        if (!isPriceInput) return;

        if (placeholder.includes('60000')) {
          input.setAttribute('placeholder', `Máx: ${MAX_CATALOG_PRICE_COP.toLocaleString('es-CO')}`);
        }

        if (input.value === '60000') {
          input.value = String(MAX_CATALOG_PRICE_COP);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Rango máximo de precio del componente legacy.
      root.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((input) => {
        if (input.max === '60000') {
          input.max = String(MAX_CATALOG_PRICE_COP);
          input.step = '5000000';
          if (Number(input.value) <= 60000) {
            input.value = String(MAX_CATALOG_PRICE_COP);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });

      // Evita que la tarjeta/lista conserve textos de moneda heredados.
      root.querySelectorAll<HTMLElement>('*').forEach((element) => {
        if (element.childElementCount === 0) {
          const text = element.textContent || '';
          if (/\$[\d,.]+\s*USD/.test(text)) {
            element.textContent = text.replace('USD', 'COP');
          }
        }
      });

      // Mantiene la indicación COP en los rangos visibles.
      root.querySelectorAll<HTMLElement>('*').forEach((element) => {
        if (element.childElementCount !== 0) return;
        const text = element.textContent || '';
        if (text.includes('Precio (USD)')) {
          element.textContent = text.replace('Precio (USD)', 'Precio (COP)');
        }
      });
    };

    localizeCurrency();
    const observer = new MutationObserver(localizeCurrency);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  const catalogFilters = {
    ...props.initialFilters,
    maxPrice: props.initialFilters?.maxPrice ?? MAX_CATALOG_PRICE_COP,
  };

  return (
    <div ref={rootRef}>
      <LegacyCatalogView
        {...props}
        vehicles={catalogVehicles}
        initialFilters={catalogFilters}
      />
    </div>
  );
};
