'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { getFloodExtent, getCurrentRisk } from '@/lib/api';
import type { RiskAssessment } from '@/types';
import { RISK_CONFIG } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

// Risk → one functional color, aqua for low.
const RISK_COLOR: Record<string, string> = {
    critical: '#991b1b',
    high: '#c2410c',
    medium: '#b45309',
    low: 'var(--fw-teal)',
};
const RISK_RANK = { critical: 0, high: 1, medium: 2, low: 3 } as const;

const VILLAGES = [
    { name: 'Maga', lat: 10.856, lng: 14.921, risk: 'high' as const },
    { name: 'Pouss', lat: 10.851, lng: 15.046, risk: 'critical' as const },
    { name: 'Wina', lat: 10.748, lng: 14.955, risk: 'medium' as const },
    { name: 'Guirvidig', lat: 10.944, lng: 14.700, risk: 'medium' as const },
    { name: 'Yagoua', lat: 10.343, lng: 15.234, risk: 'low' as const },
    { name: 'Kar Hay', lat: 10.920, lng: 14.820, risk: 'high' as const },
];

const MapLoadingComponent = () => {
    const { t } = useLanguage();
    return (
        <div className="flex h-full w-full items-center justify-center"
            style={{ background: 'var(--fw-mist)' }}>
            <div className="flex flex-col items-center gap-3">
                <div className="h-9 w-9 animate-spin rounded-full border-[3px]"
                    style={{ borderColor: 'var(--fw-line)', borderTopColor: 'var(--fw-teal)' }} />
                <p className="text-[13px]" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                    {t('map.loading')}
                </p>
            </div>
        </div>
    );
};

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
    loading: MapLoadingComponent,
});

export default function MapPage() {
    const { t, locale } = useLanguage();
    const [floodGeoJSON, setFloodGeoJSON] = useState<any>(null);
    const [risk, setRisk] = useState<RiskAssessment | null>(null);

    useEffect(() => {
        Promise.all([
            getFloodExtent().catch(() => null),
            getCurrentRisk().catch(() => null),
        ]).then(([geo, r]) => {
            setFloodGeoJSON(geo);
            setRisk(r);
        });
    }, []);

    const sortedVillages = [...VILLAGES].sort((a, b) => RISK_RANK[a.risk] - RISK_RANK[b.risk]);
    const riskColor = risk ? (RISK_COLOR[risk.risk_level] ?? 'var(--fw-teal)') : 'var(--fw-teal)';

    return (
        <div className="min-h-screen" style={{ background: 'var(--fw-paper)' }}>
            <Navbar />

            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

                {/* Header */}
                <div className="flex items-end justify-between gap-6 flex-wrap mb-8 fw-rise">
                    <div>
                        <p className="text-[12px] tracking-[0.18em] uppercase mb-2"
                            style={{ color: 'var(--fw-teal)' }}>
                            Maga · Cameroon
                        </p>
                        <h1 className="text-3xl sm:text-[2.2rem] font-semibold tracking-tight leading-none"
                            style={{ color: 'var(--fw-deep)' }}>
                            {t('map.title')}
                        </h1>
                        <p className="mt-3 text-[14px] max-w-lg" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                            {t('map.desc')}
                        </p>
                    </div>

                    {risk && (
                        <div className="flex items-center gap-3 fw-rise fw-d2">
                            <div className="text-right">
                                <div className="text-[10.5px] uppercase tracking-[0.14em]"
                                    style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                                    {t('map.current_risk')}
                                </div>
                                <div className="text-[15px] font-medium mt-0.5" style={{ color: riskColor }}>
                                    {locale === 'fr'
                                        ? RISK_CONFIG[risk.risk_level].labelFr
                                        : RISK_CONFIG[risk.risk_level].label}
                                </div>
                            </div>
                            <span className="inline-block w-3 h-3 rounded-full" style={{ background: riskColor }} />
                        </div>
                    )}
                </div>

                {/* Map */}
                <section className="overflow-hidden rounded-2xl border fw-rise"
                    style={{ borderColor: 'var(--fw-line)' }}>
                    <div className="h-[58vh] min-h-[460px] w-full">
                        <LeafletMap floodGeoJSON={floodGeoJSON} villages={VILLAGES} />
                    </div>
                </section>

                {/* Legend + Villages */}
                <div className="grid gap-6 lg:grid-cols-5 mt-8">

                    {/* Legend */}
                    <div className="lg:col-span-2 rounded-2xl border p-6 fw-rise"
                        style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                        <h2 className="text-[11px] uppercase tracking-[0.16em] mb-5"
                            style={{ color: 'var(--fw-teal)' }}>
                            {t('map.legend.title')}
                        </h2>
                        <ul className="space-y-3.5">
                            <li className="flex items-center gap-3">
                                <span className="h-3 w-5 rounded" style={{ background: 'var(--fw-aqua)', opacity: 0.6 }} />
                                <span className="text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.75 }}>
                                    Flood extent
                                </span>
                            </li>
                            {(['low', 'medium', 'high', 'critical'] as const).map(level => (
                                <li key={level} className="flex items-center gap-3">
                                    <span className="h-3 w-3 rounded-full" style={{ background: RISK_COLOR[level] }} />
                                    <span className="text-[13.5px] capitalize"
                                        style={{ color: 'var(--fw-ink)', opacity: 0.75 }}>
                                        {level} risk
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Village table */}
                    <div className="lg:col-span-3 rounded-2xl border p-6 fw-rise fw-d2"
                        style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-[11px] uppercase tracking-[0.16em]"
                                style={{ color: 'var(--fw-teal)' }}>
                                {t('map.table.title')}
                            </h2>
                            <span className="text-[12px]" style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                {sortedVillages.length} villages
                            </span>
                        </div>

                        <ul className="divide-y" style={{ borderColor: 'var(--fw-line)' }}>
                            {sortedVillages.map((v) => {
                                const color = RISK_COLOR[v.risk];
                                return (
                                    <li key={v.name}
                                        className="flex items-center justify-between gap-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <span className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                                style={{ background: color }} />
                                            <div>
                                                <p className="text-[14px] font-medium" style={{ color: 'var(--fw-deep)' }}>
                                                    {v.name}
                                                </p>
                                                <p className="text-[11.5px] font-mono"
                                                    style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                                    {v.lat.toFixed(3)}°N, {v.lng.toFixed(3)}°E
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[12.5px] font-medium" style={{ color }}>
                                            {locale === 'fr'
                                                ? RISK_CONFIG[v.risk].labelFr
                                                : RISK_CONFIG[v.risk].label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Data source — quiet line */}
                <p className="mt-8 text-[13px] leading-relaxed max-w-3xl border-t pt-6"
                    style={{ color: 'var(--fw-ink)', opacity: 0.55, borderColor: 'var(--fw-line)' }}>
                    <span className="font-medium" style={{ color: 'var(--fw-deep)', opacity: 1 }}>
                        {t('map.data_source.title')}
                    </span>{' '}
                    {t('map.data_source.desc')}
                </p>
            </div>
        </div>
    );
}