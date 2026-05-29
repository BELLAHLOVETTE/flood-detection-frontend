// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format a date string for display
export function formatDate(dateStr: string, pattern = 'dd MMM yyyy'): string {
    try {
        return format(parseISO(dateStr), pattern, { locale: fr });
    } catch {
        return dateStr;
    }
}

// Format a datetime as "2 hours ago"
export function timeAgo(dateStr: string): string {
    try {
        return formatDistanceToNow(parseISO(dateStr), {
            addSuffix: true,
            locale: fr,
        });
    } catch {
        return 'Unknown';
    }
}

// Format a number with commas
export function formatNumber(n: number): string {
    return new Intl.NumberFormat('fr-FR').format(n);
}

// Convert probability to percentage string
export function toPercent(probability: number): string {
    return `${(probability * 100).toFixed(0)}%`;
}