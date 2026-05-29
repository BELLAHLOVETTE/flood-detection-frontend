// src/app/history/page.tsx
import Navbar from '@/components/Navbar';
import { getFloodEvents } from '@/lib/api';
import { formatDate, formatNumber } from '@/lib/utils';
import { RISK_CONFIG } from '@/types';
import { History, AlertTriangle, Users, MapPin, Calendar } from 'lucide-react';

export const revalidate = 3600; // refresh every hour

export default async function HistoryPage() {
    const events = await getFloodEvents().catch(() => []);

    // Group events by decade for the timeline
    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
    );

    // Calculate totals
    const totalAffected = events.reduce((sum, e) => sum + e.affected_population, 0);
    const totalArea = events.reduce((sum, e) => sum + e.affected_area_km2, 0);
    const criticalCount = events.filter((e) => e.severity === 'critical').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <History className="w-6 h-6 text-blue-600" />
                        Historique des inondations
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Événements d&apos;inondation enregistrés à Maga et dans la région de Mayo Danay
                    </p>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        label="Événements enregistrés"
                        value={String(events.length)}
                        icon={<History className="w-5 h-5 text-blue-500" />}
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        label="Personnes affectées (total)"
                        value={formatNumber(totalAffected)}
                        icon={<Users className="w-5 h-5 text-orange-500" />}
                        bgColor="bg-orange-50"
                    />
                    <StatCard
                        label="Surface totale inondée"
                        value={`${totalArea.toFixed(0)} km²`}
                        icon={<MapPin className="w-5 h-5 text-teal-500" />}
                        bgColor="bg-teal-50"
                    />
                    <StatCard
                        label="Événements critiques"
                        value={String(criticalCount)}
                        icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                        bgColor="bg-red-50"
                    />
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                    <div className="space-y-6">
                        {sortedEvents.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Aucun événement enregistré</p>
                                <p className="text-sm mt-1">
                                    Ajoutez des événements via le panneau d&apos;administration
                                </p>
                            </div>
                        ) : (
                            sortedEvents.map((event, index) => {
                                const config = RISK_CONFIG[event.severity];
                                return (
                                    <div key={event.id} className="relative flex gap-6 pl-16">

                                        {/* Timeline dot */}
                                        <div
                                            className="absolute left-4 top-5 w-5 h-5 rounded-full
                                 border-4 border-white shadow-sm flex-shrink-0"
                                            style={{ backgroundColor: config.color }}
                                        />

                                        {/* Event Card */}
                                        <div className="flex-1 bg-white rounded-xl border border-gray-100
                                    shadow-sm p-5 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col sm:flex-row sm:items-start
                                      justify-between gap-3 mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span
                                                            className={`text-xs font-semibold px-2.5 py-1 rounded-full
                                          ${config.bgColor} ${config.textColor}`}
                                                        >
                                                            {config.icon} {config.labelFr}
                                                        </span>
                                                        {event.is_confirmed && (
                                                            <span className="text-xs text-green-600 bg-green-50
                                               px-2 py-0.5 rounded-full">
                                                                ✓ Confirmé
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        Inondation de {formatDate(event.event_date, 'MMMM yyyy')}
                                                    </h3>
                                                </div>

                                                {/* Dates */}
                                                <div className="text-right flex-shrink-0">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(event.event_date)}
                                                    </div>
                                                    {event.end_date && (
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            au {formatDate(event.end_date)}
                                                            {event.duration_days && (
                                                                <span className="ml-1">
                                                                    ({event.duration_days} jours)
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {event.description && (
                                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                    {event.description}
                                                </p>
                                            )}

                                            {/* Stats Row */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                <EventStat
                                                    label="Personnes affectées"
                                                    value={formatNumber(event.affected_population)}
                                                    icon="👥"
                                                />
                                                <EventStat
                                                    label="Surface inondée"
                                                    value={`${event.affected_area_km2.toFixed(0)} km²`}
                                                    icon="🗺️"
                                                />
                                                <EventStat
                                                    label="Source"
                                                    value={event.source || 'Non spécifié'}
                                                    icon="📄"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Source Note */}
                <div className="mt-8 bg-gray-100 rounded-xl p-4">
                    <p className="text-xs text-gray-500 text-center">
                        Sources: OCHA Cameroun, UNOSAT, Rapports du gouvernement camerounais,
                        Croix-Rouge Cameroun. Les données historiques antérieures à 2015
                        proviennent d&apos;archives documentaires.
                    </p>
                </div>

            </div>
        </div>
    );
}

function StatCard({
    label, value, icon, bgColor,
}: {
    label: string; value: string;
    icon: React.ReactNode; bgColor: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`inline-flex p-2 rounded-lg ${bgColor} mb-2`}>
                {icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
    );
}

function EventStat({
    label, value, icon,
}: {
    label: string; value: string; icon: string;
}) {
    return (
        <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 flex items-center gap-1">
                <span>{icon}</span> {label}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                {value}
            </p>
        </div>
    );
}