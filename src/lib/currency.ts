/**
 * Format number as Indonesian Rupiah with dot separators (e.g., Rp 150.000.000)
 */
export function formatIDR(amount: number): string {
  const str = Math.round(amount).toString()
  const parts: string[] = []
  for (let i = str.length; i > 0; i -= 3) {
    parts.unshift(str.slice(Math.max(0, i - 3), i))
  }
  return `Rp ${parts.join('.')}`
}

/**
 * Format a number as budget label (e.g., 150.000.000)
 */
export function formatIDRBudget(amount: number): string {
  const str = Math.round(amount).toString()
  const parts: string[] = []
  for (let i = str.length; i > 0; i -= 3) {
    parts.unshift(str.slice(Math.max(0, i - 3), i))
  }
  return parts.join('.')
}
