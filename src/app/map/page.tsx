// src/app/map/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { getFloodExtent, getCurrentRisk } from '@/lib/api';
import type { RiskAssessment } from '@/types';
import { RISK_CONFIG } from '@/types';
import { MapPin, Layers, Info, AlertTriangle, Droplets, Database } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const MapLoadingComponent = () => {
    const { t } = useLanguage();
    return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
                <p className="text-sm font-medium text-slate-600">{t('map.loading')}</p>
            </div>
        </div>
    );
};

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
    loading: MapLoadingComponent,
});

const VILLAGES = [
    { name: 'Maga', lat: 10.856, lng: 14.921, risk: 'high' as const },
    { name: 'Pouss', lat: 10.851, lng: 15.046, risk: 'critical' as const },
    { name: 'Wina', lat: 10.748, lng: 14.955, risk: 'medium' as const },
    { name: 'Guirvidig', lat: 10.944, lng: 14.700, risk: 'medium' as const },
    { name: 'Yagoua', lat: 10.343, lng: 15.234, risk: 'low' as const },
    { name: 'Kar Hay', lat: 10.920, lng: 14.820, risk: 'high' as const },
];

const RISK_RANK = { critical: 0, high: 1, medium: 2, low: 3 } as const;

const RISK_STYLES: Record<string, { bg: string; ring: string; text: string; dot: string }> = {
    critical: { bg: 'bg-red-50', ring: 'ring-red-200', text: 'text-red-700', dot: 'bg-red-500' },
    high: { bg: 'bg-orange-50', ring: 'ring-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
    medium: { bg: 'bg-amber-50', ring: 'ring-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' },
    low: { bg: 'bg-emerald-50', ring: 'ring-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export default function MapPage() {
    const { t, locale } = useLanguage();
    const [floodGeoJSON, setFloodGeoJSON] = useState<any>(null);
    const [risk, setRisk] = useState<RiskAssessment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getFloodExtent().catch(() => null),
            getCurrentRisk().catch(() => null),
        ]).then(([geo, r]) => {
            setFloodGeoJSON(geo);
            setRisk(r);
            setLoading(false);
        });
    }, []);

    const sortedVillages = [...VILLAGES].sort((a, b) => RISK_RANK[a.risk] - RISK_RANK[b.risk]);
    const currentRiskStyle = risk ? RISK_STYLES[risk.risk_level] : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40">
            <Navbar />

            {/* Hero header */}
            <header className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600">
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
                <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
                    <div className="flex flex-col items-center justify-center text-center gap-8">
                        <div className="max-w-3xl flex flex-col items-center">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                                <Droplets className="h-3.5 w-3.5" />
                                Maga · Cameroon
                            </div>
                            <h1 className="flex items-center justify-center gap-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                <MapPin className="h-9 w-9" />
                                {t('map.title')}
                            </h1>
                            <p className="mt-3 text-base text-sky-50/90 sm:text-lg">{t('map.desc')}</p>
                        </div>

                        {risk && currentRiskStyle && (
                            <div className="relative">
                                <span className={`absolute -inset-1 rounded-2xl ${currentRiskStyle.dot} opacity-30 blur-lg animate-pulse`} />
                                <div className={`relative flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ${currentRiskStyle.ring}`}>
                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${currentRiskStyle.bg}`}>
                                        <AlertTriangle className={`h-6 w-6 ${currentRiskStyle.text}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            {t('map.current_risk')}
                                        </p>
                                        <p className={`text-lg font-bold ${currentRiskStyle.text}`}>
                                            {RISK_CONFIG[risk.risk_level].icon}{' '}
                                            {locale === 'fr' ? RISK_CONFIG[risk.risk_level].labelFr : RISK_CONFIG[risk.risk_level].label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
                {/* Map */}
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-sky-900/5 ring-1 ring-slate-200/50">
                    <div className="h-[60vh] min-h-[480px] w-full">
                        <LeafletMap floodGeoJSON={floodGeoJSON} villages={VILLAGES} />
                    </div>
                </section>

                {/* Legend + Villages */}
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Legend */}
                    <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
                                <Layers className="h-5 w-5 text-sky-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">{t('map.legend.title')}</h2>
                        </div>
                        <ul className="space-y-3">
                            <LegendItem swatchClass="bg-sky-500/60" label="Flood Extent" />
                            <LegendItem swatchClass="bg-emerald-500" label="Low Risk" dot />
                            <LegendItem swatchClass="bg-amber-400" label="Medium Risk" dot />
                            <LegendItem swatchClass="bg-orange-500" label="High Risk" dot />
                            <LegendItem swatchClass="bg-red-500" label="Critical Risk" dot />
                        </ul>
                    </div>

                    {/* Village Risk Table */}
                    <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
                                    <MapPin className="h-5 w-5 text-sky-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">{t('map.table.title')}</h2>
                            </div>
                            <span className="text-xs font-medium text-slate-500">
                                {sortedVillages.length} villages
                            </span>
                        </div>

                        <ul className="divide-y divide-slate-100">
                            {sortedVillages.map((v) => {
                                const s = RISK_STYLES[v.risk];
                                return (
                                    <li
                                        key={v.name}
                                        className="group flex items-center justify-between gap-4 py-3 transition hover:bg-slate-50/80 rounded-lg px-2 -mx-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`h-2.5 w-2.5 rounded-full ${s.dot} ring-4 ring-offset-0 ${s.bg}`} />
                                            <div>
                                                <p className="font-medium text-slate-900">{v.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {v.lat.toFixed(3)}°N, {v.lng.toFixed(3)}°E
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${s.bg} ${s.text} ${s.ring}`}
                                        >
                                            {RISK_CONFIG[v.risk].icon}{' '}
                                            {locale === 'fr' ? RISK_CONFIG[v.risk].labelFr : RISK_CONFIG[v.risk].label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Data Source */}
                <aside className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 text-sm text-slate-700">
                    <Database className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-600" />
                    <p>
                        <span className="font-semibold text-slate-900">{t('map.data_source.title')}</span>{' '}
                        {t('map.data_source.desc')}
                    </p>
                </aside>
            </main>
        </div>
    );
}

function LegendItem({
    swatchClass,
    label,
    dot = false,
}: {
    swatchClass: string;
    label: string;
    dot?: boolean;
}) {
    return (
        <li className="flex items-center gap-3">
            {dot ? (
                <span className={`h-3.5 w-3.5 rounded-full ${swatchClass}`} />
            ) : (
                <span className={`h-4 w-6 rounded ${swatchClass}`} />
            )}
            <span className="text-sm text-slate-700">{label}</span>
        </li>
    );
}
