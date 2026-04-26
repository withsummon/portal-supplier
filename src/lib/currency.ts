// Currency conversion utilities
// Default exchange rate: 1 USD = 16,000 IDR (can be updated dynamically in production)

export const USD_TO_IDR_RATE = 16000

/**
 * Convert USD amount to Indonesian Rupiah
 */
export function convertToIDR(usdAmount: number): number {
  return usdAmount * USD_TO_IDR_RATE
}

/**
 * Format number as Indonesian Rupiah
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format USD amount to IDR string
 */
export function formatUSDtoIDR(usdAmount: number): string {
  return formatIDR(convertToIDR(usdAmount))
}

/**
 * Parse currency string to number (handles USD, IDR formats)
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols and formatting
  const cleaned = value.replace(/[$,¥€£Rp\s]/gi, '').replace(/\./g, '')
  return parseFloat(cleaned) || 0
}
