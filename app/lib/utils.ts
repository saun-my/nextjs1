import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  // amounts are stored in cents; convert to currency units
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export function generateYAxis<T extends { revenue: number }>(
  revenueData: T[] | undefined | null
): { yAxisLabels: string[]; topLabel: number } {
  const hasData = Array.isArray(revenueData) && revenueData.length > 0;
  const maxRevenue = hasData ? Math.max(...revenueData.map((r) => r.revenue)) : 0;

  // Round up to a nice scale (nearest 1000)
  const topLabel = maxRevenue > 0 ? Math.ceil(maxRevenue / 1000) * 1000 : 0;

  // Build 5 evenly spaced labels from top → 0
  const steps = 4;
  const yAxisLabels: string[] = [];
  for (let i = steps; i >= 0; i--) {
    const value = topLabel > 0 ? Math.round((topLabel / steps) * i) : 0;
    yAxisLabels.push(value.toLocaleString());
  }

  return { yAxisLabels, topLabel };
}

export function formatDateToLocal(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function generatePagination(
  currentPage: number,
  totalPages: number
): Array<number | string> {
  const pages: Array<number | string> = []
  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)
  const range: number[] = []

  for (let i = start; i <= end; i++) range.push(i)

  if (range[0] !== 1) {
    pages.push(1)
    if (range[0] > 2) pages.push('...')
  }

  pages.push(...range)

  if (range[range.length - 1] !== totalPages) {
    if (range[range.length - 1] < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  return pages
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean = false
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}