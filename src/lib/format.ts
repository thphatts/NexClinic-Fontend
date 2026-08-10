/**
 * Deterministically formats numbers with thousands separators for both SSR and Client.
 * Eliminates React Hydration Mismatch errors caused by locale variations.
 */
export function formatNumber(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatCurrency(amount: number): string {
  return `₫${formatNumber(amount)}`;
}
