// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, pattern = 'dd MMM yyyy'): string {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, pattern, { locale: fr });
  } catch { return dateStr; }
}

export function timeAgo(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return 'Inconnu';
    return formatDistanceToNow(d, { addSuffix: true, locale: fr });
  } catch { return 'Inconnu'; }
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n);
}

export function toPercent(p: number): string {
  return `${(p * 100).toFixed(0)}%`;
}

export function clampPercent(value: number, max = 150): number {
  return Math.min(Math.max(value, 0), max);
}