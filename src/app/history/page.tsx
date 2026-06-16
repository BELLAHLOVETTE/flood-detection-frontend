'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { getFloodEvents } from '@/lib/api';
import { formatDate, formatNumber, cn } from '@/lib/utils';
import { RISK_CONFIG, type RiskLevel } from '@/types';
import {
    History, AlertTriangle, Users, MapPin, Calendar,
    ChevronLeft, ChevronRight, Filter, Droplets, X, CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { fr, enUS } from 'date-fns/locale';

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2016, 2014, 2012, 2010, 2008, 2007, 2005, 2003];
const PAGE_SIZE = 5;

const SEVERITY_STYLES: Record<string, { bar: string; dot: string; ring: string; bg: string; text: string }> = {
    critical: { bar: 'bg-red-500', dot: 'bg-red-500', ring: 'ring-red-200', bg: 'bg-red-50', text: 'text-red-700' },
    high: { bar: 'bg-orange-500', dot: 'bg-orange-500', ring: 'ring-orange-200', bg: 'bg-orange-50', text: 'text-orange-700' },
    medium: { bar: 'bg-amber-400', dot: 'bg-amber-400', ring: 'ring-amber-200', bg: 'bg-amber-50', text: 'text-amber-700' },
    low: { bar: 'bg-emerald-500', dot: 'bg-emerald-500', ring: 'ring-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

export default function HistoryPage() {
    const { t, locale } = useLanguage();
    const [year, setYear] = useState('');
    const [severity, setSeverity] = useState('');
    const [page, setPage] = useState(1);

    const { data: events = [], isLoading } = useQuery({
        queryKey: ['flood-events', year, severity],
        queryFn: () =>
            getFloodEvents({
                year: year ? Number(year) : undefined,
                severity: severity || undefined,
            }),
    });

    const dateLocale = locale === 'fr' ? fr : enUS;

    const SEVERITIES = [
        { value: '', label: t('hist.filter.all_levels') },
        { value: 'critical', label: `🔴 ${locale === 'fr' ? 'Critique' : 'Critical'}` },
        { value: 'high', label: `🟠 ${locale === 'fr' ? 'Élevé' : 'High'}` },
        { value: 'medium', label: `🟡 ${locale === 'fr' ? 'Modéré' : 'Moderate'}` },
        { value: 'low', label: `🟢 ${locale === 'fr' ? 'Faible' : 'Low'}` },
    ];

    const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
    const paginated = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const totalAffected = events.reduce((s, e) => s + e.affected_population, 0);
    const totalArea = events.reduce((s, e) => s + e.affected_area_km2, 0);
    const criticalCount = events.filter((e) => e.severity === 'critical').length;
    const hasFilters = Boolean(year || severity);

    function resetFilters() {
        setYear(''); setSeverity(''); setPage(1);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40">
            <Navbar />

            {/* Hero */}
            <header className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-700">
                <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
                <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        <Droplets className="h-3.5 w-3.5" />
                        Maga · Cameroon
                    </div>
                    <h1 className="flex items-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        <History className="h-9 w-9" />
                        {t('hist.title')}
                    </h1>
                    <p className="mt-3 max-w-2xl text-base text-sky-50/90 sm:text-lg">{t('hist.desc')}</p>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
                {/* Stats */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={<Calendar className="h-5 w-5" />} tone="blue" label={t('hist.stat.events')} value={String(events.length)} />
                    <StatCard icon={<Users className="h-5 w-5" />} tone="orange" label={t('hist.stat.affected')} value={formatNumber(totalAffected)} />
                    <StatCard icon={<MapPin className="h-5 w-5" />} tone="teal" label={t('hist.stat.area')} value={`${totalArea.toFixed(0)} km²`} />
                    <StatCard icon={<AlertTriangle className="h-5 w-5" />} tone="red" label={t('hist.stat.critical')} value={String(criticalCount)} />
                </section>

                {/* Filters */}
                <section className="sticky top-4 z-10 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Filter className="h-4 w-4 text-sky-600" />
                            {t('hist.filter.label')}
                        </div>

                        <select
                            value={year}
                            onChange={(e) => { setYear(e.target.value); setPage(1); }}
                            className="min-w-[140px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="">{t('hist.filter.all_years')}</option>
                            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>

                        <select
                            value={severity}
                            onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
                            className="min-w-[160px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            {SEVERITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>

                        {hasFilters && (
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                <X className="h-4 w-4" />
                                {t('hist.filter.reset')}
                            </button>
                        )}

                        <span className="ml-auto rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                            {events.length === 1
                                ? t('hist.results', { val: events.length })
                                : t('hist.results_plural', { val: events.length })}
                        </span>
                    </div>
                </section>

                {/* Timeline */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-40 animate-pulse rounded-3xl bg-slate-100" />
                        ))}
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                            <AlertTriangle className="h-7 w-7 text-slate-400" />
                        </div>
                        <p className="text-base font-medium text-slate-700">{t('hist.empty')}</p>
                        {hasFilters && (
                            <button
                                onClick={resetFilters}
                                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                            >
                                <X className="h-4 w-4" />
                                {t('hist.reset_filters')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="relative pl-8 sm:pl-12">
                        {/* Timeline rail */}
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-300 via-amber-300 to-emerald-300 sm:left-5" />

                        <ol className="space-y-6">
                            {paginated.map((event) => {
                                const cfg = RISK_CONFIG[event.severity as RiskLevel];
                                const s = SEVERITY_STYLES[event.severity] ?? SEVERITY_STYLES.medium;
                                return (
                                    <li key={event.id} className="relative">
                                        {/* Dot */}
                                        <span
                                            className={cn(
                                                'absolute -left-[1.4rem] top-6 h-4 w-4 rounded-full ring-4 ring-white shadow',
                                                s.dot,
                                                'sm:-left-[1.85rem]'
                                            )}
                                        />

                                        {/* Card */}
                                        <article
                                            className={cn(
                                                'group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md',
                                                'border-l-4',
                                                s.bar.replace('bg-', 'border-l-')
                                            )}
                                        >
                                            <header className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1', s.bg, s.text, s.ring)}>
                                                            {cfg.icon} {locale === 'fr' ? cfg.labelFr : cfg.label}
                                                        </span>
                                                        {event.is_confirmed && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                {t('hist.confirmed')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                                        {t('hist.flood_of', {
                                                            val: formatDate(event.event_date, 'MMMM yyyy'),
                                                        })}
                                                    </h3>
                                                </div>

                                                <div className="text-right text-xs text-slate-500">
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatDate(event.event_date)}
                                                    </div>
                                                    {event.end_date && (
                                                        <div className="mt-0.5">
                                                            {t('hist.to', { val: formatDate(event.end_date) })}
                                                            {event.duration_days != null && (
                                                                <span className="ml-1 text-slate-400">({event.duration_days}j)</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </header>

                                            {event.description && (
                                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                                    {event.description}
                                                </p>
                                            )}

                                            <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-3">
                                                <EventStat icon="👥" label="People affected" value={formatNumber(event.affected_population)} />
                                                <EventStat icon="🗺️" label="Area flooded" value={`${event.affected_area_km2} km²`} />
                                                <EventStat icon="📄" label="Source" value={event.source || '—'} />
                                            </div>
                                        </article>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            {t('hist.prev')}
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={cn(
                                        'h-9 w-9 rounded-xl text-sm font-medium transition',
                                        p === page
                                            ? 'bg-sky-600 text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-100'
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {t('hist.next')}
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                )}

                <p className="pt-4 text-center text-xs text-slate-500">{t('hist.sources')}</p>
            </main>
        </div>
    );
}

/* ---------- Subcomponents ---------- */

const TONES = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
} as const;

function StatCard({
    icon, tone, label, value,
}: {
    icon: React.ReactNode;
    tone: keyof typeof TONES;
    label: string;
    value: string;
}) {
    const t = TONES[tone];
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', t.bg, t.text)}>
                {icon}
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
    );
}

function EventStat({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100 sm:flex-col sm:items-start sm:justify-center">
            <span className="text-xs text-slate-500">
                <span className="mr-1">{icon}</span>
                {label}
            </span>
            <span className="text-sm font-semibold text-slate-900">{value}</span>
        </div>
    );
}
