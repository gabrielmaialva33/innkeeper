import { DateTime } from 'luxon'

// Helper to format dates
export function formatDate(date: string): string {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)
}

// Helper to format date and time
export function formatDateTime(date: string): string {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT)
}
