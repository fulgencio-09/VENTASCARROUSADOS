/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Punto de entrada del catálogo. Todos los precios están en COP.
 */

import React from 'react';
import { CatalogView as LegacyCatalogView } from './CatalogViewLegacy';

export const CatalogView: React.FC<React.ComponentProps<typeof LegacyCatalogView>> = (props) => (
  <LegacyCatalogView {...props} />
);
