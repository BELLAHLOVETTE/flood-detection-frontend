// src/app/history/page.tsx
'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { getFloodEvents } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { RISK_CONFIG, type RiskLevel } from '@/types';
import {
    History, AlertTriangle, Users, MapPin,
    Calendar, ChevronLeft, ChevronRight, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2016, 2014, 2012, 2010, 2008, 2007, 2005, 2003];
const SEVERITIES = [
    { value: '', label: 'Tous les niveaux' },
    { value: 'critical', label: '🔴 Critique' },
    { value: 'high', label: '🟠 Élevé' },
    { value: 'medium', label: '🟡 Modéré' },
    { value: 'low', label: '🟢 Faible' },
];
const PAGE_SIZE = 5;

export default function HistoryPage() {
    const [year, setYear] = useState('');
    const [severity, setSeverity] = useState('');
    const [page, setPage] = useState(1);

    const { data: events = [], isLoading } = useQuery({
        queryKey: ['flood-events', year, severity],
        queryFn: () => getFloodEvents({
            year: year ? Number(year) : undefined,
            severity: severity || undefined,
        }),
    });

    // Client-side pagination
    const totalPages = Math.ceil(events.length / PAGE_SIZE);
    const paginated = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Summary stats from all events
    const totalAffected = events.reduce((s, e) => s + e.affected_population, 0);
    const totalArea = events.reduce((s, e) => s + e.affected_area_km2, 0);
    const criticalCount = events.filter((e) => e.severity === 'critical').length;

    function resetFilters() {
        setYear(''); setSeverity(''); setPage(1);
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <History className="w-6 h-6 text-blue-600" />
                        Historique des inondations
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Événements enregistrés à Maga et dans la région de Mayo Danay
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={<History className="w-5 h-5 text-blue-500" />}
                        bg="bg-blue-50"
                        label="Événements"
                        value={String(events.length)} />
                    <StatCard icon={<Users className="w-5 h-5 text-orange-500" />}
                        bg="bg-orange-50"
                        label="Personnes affectées"
                        value={formatNumber(totalAffected)} />
                    <StatCard icon={<MapPin className="w-5 h-5 text-teal-500" />}
                        bg="bg-teal-50"
                        label="Surface totale"
                        value={`${totalArea.toFixed(0)} km²`} />
                    <StatCard icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                        bg="bg-red-50"
                        label="Événements critiques"
                        value={String(criticalCount)} />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                            <Filter className="w-4 h-4" />
                            Filtres:
                        </div>

                        <select
                            value={year}
                            onChange={(e) => { setYear(e.target.value); setPage(1); }}
                            className="flex-1 min-w-[140px] px-3 py-2 text-sm border border-gray-200
                         rounded-xl bg-gray-50 focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:bg-white transition-all"
                        >
                            <option value="">Toutes les années</option>
                            {YEARS.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>

                        <select
                            value={severity}
                            onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
                            className="flex-1 min-w-[160px] px-3 py-2 text-sm border border-gray-200
                         rounded-xl bg-gray-50 focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:bg-white transition-all"
                        >
                            {SEVERITIES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>

                        {(year || severity) && (
                            <button
                                onClick={resetFilters}
                                className="px-3 py-2 text-sm text-gray-500 hover:text-red-600
                           hover:bg-red-50 rounded-xl transition-colors"
                            >
                                Réinitialiser
                            </button>
                        )}

                        <span className="ml-auto text-xs text-gray-400">
                            {events.length} résultat{events.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Timeline */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i}
                                className="bg-white rounded-2xl border border-gray-100 h-40 animate-pulse" />
                        ))}
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm
                          p-12 text-center">
                        <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">Aucun événement trouvé</p>
                        {(year || severity) && (
                            <button onClick={resetFilters}
                                className="mt-3 text-sm text-blue-600 hover:underline">
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                        <div className="space-y-5">
                            {paginated.map((event) => {
                                const cfg = RISK_CONFIG[event.severity as RiskLevel];
                                return (
                                    <div key={event.id} className="relative flex gap-5 pl-16">

                                        {/* Dot */}
                                        <div
                                            className="absolute left-4 top-5 w-5 h-5 rounded-full
                                 border-4 border-slate-50 shadow-sm"
                                            style={{ backgroundColor: cfg.color }}
                                        />

                                        {/* Card */}
                                        <div className="flex-1 bg-white rounded-2xl border border-gray-100
                                    shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5
                                    transition-all duration-200">

                                            <div className="flex flex-col sm:flex-row sm:items-start
                                      justify-between gap-3 mb-3">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                        <span className={cn(
                                                            'text-xs font-semibold px-2.5 py-1 rounded-full',
                                                            cfg.bgColor, cfg.textColor
                                                        )}>
                                                            {cfg.icon} {cfg.labelFr}
                                                        </span>
                                                        {event.is_confirmed && (
                                                            <span className="text-xs text-green-600 bg-green-50
                                               px-2 py-0.5 rounded-full border
                                               border-green-200">
                                                                ✓ Confirmé
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-base font-bold text-gray-900">
                                                        Inondation de {formatDate(event.event_date, 'MMMM yyyy')}
                                                    </h3>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="flex items-center justify-end gap-1
                                          text-sm text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(event.event_date)}
                                                    </div>
                                                    {event.end_date && (
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            au {formatDate(event.end_date)}
                                                            {event.duration_days != null && (
                                                                <span className="ml-1">({event.duration_days}j)</span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {event.description && (
                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                    {event.description}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-3 gap-3">
                                                <EventStat icon="👥"
                                                    label="Personnes affectées"
                                                    value={formatNumber(event.affected_population)} />
                                                <EventStat icon="🗺️"
                                                    label="Surface inondée"
                                                    value={`${event.affected_area_km2.toFixed(0)} km²`} />
                                                <EventStat icon="📄"
                                                    label="Source"
                                                    value={event.source || 'Non spécifié'} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                         border border-gray-200 rounded-xl text-gray-600
                         hover:bg-gray-50 disabled:opacity-40
                         disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Précédent
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={cn(
                                        'w-9 h-9 text-sm font-medium rounded-xl transition-colors',
                                        p === page
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-100'
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                         border border-gray-200 rounded-xl text-gray-600
                         hover:bg-gray-50 disabled:opacity-40
                         disabled:cursor-not-allowed transition-colors"
                        >
                            Suivant <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="mt-8 bg-gray-100 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400">
                        Sources: OCHA Cameroun, UNOSAT, Gouvernement camerounais,
                        Croix-Rouge Cameroun
                    </p>
                </div>

            </div>
        </div>
    );
}

function StatCard({ icon, bg, label, value }: {
    icon: React.ReactNode; bg: string;
    label: string; value: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4
                    hover:shadow-md transition-shadow">
            <div className={`inline-flex p-2 rounded-xl ${bg} mb-2.5`}>{icon}</div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        </div>
    );
}

function EventStat({ icon, label, value }: {
    icon: string; label: string; value: string;
}) {
    return (
        <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                {icon} {label}
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
        </div>
    );
}