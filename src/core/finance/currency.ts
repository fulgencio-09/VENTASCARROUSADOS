/**
 * Moneda oficial de AutoMarket Pro.
 *
 * Regla de negocio: todos los valores monetarios que se muestran, almacenan
 * o cobran dentro de la plataforma deben expresarse en pesos colombianos (COP).
 * No se convierten precios reales desde USD: los datos reales deben llegar
 * desde el backend ya denominados en COP.
 */

export const APP_CURRENCY = 'COP' as const;
export const APP_LOCALE = 'es-CO' as const;

export const formatCop = (amount: number): string =>
  new Intl.NumberFormat(APP_LOCALE, {
    style: 'currency',
    currency: APP_CURRENCY,
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));

export const formatCopNumber = (amount: number): string =>
  new Intl.NumberFormat(APP_LOCALE, {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));

export const parseCopInput = (value: string): number => {
  const normalized = value.replace(/[^0-9]/g, '');
  return normalized ? Number(normalized) : 0;
};
