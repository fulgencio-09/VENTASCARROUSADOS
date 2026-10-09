/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Configuración global del sistema AutoMarket Pro
 */

export const APP_CONFIG = {
  appName: 'AutoMarket Pro',
  appVersion: '1.0.0',
  apiBaseUrl: '/api',
  currency: {
    symbol: '$',
    code: 'COP',
    locale: 'es-CO',
  },
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 48,
  },
  limits: {
    maxComparisonVehicles: 3,
    maxUploadPhotosFree: 8,
    maxUploadPhotosDestacado: 18,
    maxUploadPhotosPremium: 30,
    searchDebounceMs: 300,
  },
  storageKeys: {
    authToken: 'automarket_auth_token',
    authUser: 'automarket_auth_user',
    comparisonList: 'automarket_comparison_ids',
    savedFilters: 'automarket_saved_filters',
  },
} as const;
