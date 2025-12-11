/**
 * Centralized formatting utilities for Phase 4
 * Ensures consistent display across the application
 */

/**
 * Formats a date string to "MMM D, YYYY" format
 * @param date - ISO date string or date string
 * @returns Formatted date like "Dec 10, 2025"
 */
export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return '—'
  }
}

/**
 * Formats currency with + or - prefix
 * Always shows two decimals
 * @param value - Numeric value to format
 * @returns Formatted string like "+$45.00" or "-$12.50"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  
  const absValue = Math.abs(value)
  const formatted = absValue.toFixed(2)
  
  if (value >= 0) {
    return `+$${formatted}`
  } else {
    return `-$${formatted}`
  }
}

/**
 * Formats a multiplier value (e.g., ROI)
 * @param value - Numeric multiplier
 * @returns Formatted string like "3.1x"
 */
export function formatMultiplier(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  
  return `${value.toFixed(1)}x`
}

