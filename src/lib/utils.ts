// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import type { Locale } from './translations';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateStr: string,
  pattern = 'dd MMM yyyy'
): string {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, pattern);
  } catch {
    return dateStr;
  }
}

export function timeAgo(dateStr: string, locale: Locale = 'en'): string {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return locale === 'fr' ? 'Inconnu' : 'Unknown';
    const loc = locale === 'fr' ? fr : enUS;
    return formatDistanceToNow(d, { addSuffix: true, locale: loc });
  } catch { return locale === 'fr' ? 'Inconnu' : 'Unknown'; }
}

export function formatNumber(n: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US').format(n);
}

export function toPercent(p: number): string {
  return `${(p * 100).toFixed(0)}%`;
}

export function clampPercent(value: number, max = 150): number {
  return Math.min(Math.max(value, 0), max);
}