/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Catálogo normalizado: todos los precios llegan y se procesan en COP.
 */

import React from 'react';
import { Vehicle } from '../../types/marketplace';
import { CatalogView as LegacyCatalogView } from './CatalogViewLegacy';

const MAX_CATALOG_PRICE_COP = 250_000_000;

export const CatalogView: React.FC<React.ComponentProps<typeof LegacyCatalogView>> = (props) => {
  const catalogVehicles = props.vehicles.map((vehicle) => ({
    ...vehicle,
    // Compatibilidad interna con el componente legacy: el valor es COP,
    // nunca USD. No se realiza ninguna conversión monetaria.
    priceUsd: vehicle.priceCop ?? 0,
    priceCop: vehicle.priceCop ?? 0,
  }));

  return (
    <LegacyCatalogView
      {...props}
      vehicles={catalogVehicles}
      initialFilters={{
        ...props.initialFilters,
        maxPrice: props.initialFilters?.maxPrice ?? MAX_CATALOG_PRICE_COP,
      }}
    />
  );
};
