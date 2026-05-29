// src/app/map/page.tsx
'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { getFloodExtent, getCurrentRisk } from '@/lib/api';
import type { RiskAssessment } from '@/types';
import { RISK_CONFIG } from '@/types';
import { MapPin, Layers, Info } from 'lucide-react';

// Leaflet must be loaded dynamically — it does not work with SSR
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Chargement de la carte...</p>
            </div>
        </div>
    ),
});

// Key villages in the Maga area with their risk classifications
const VILLAGES = [
    { name: 'Maga', lat: 10.856, lng: 14.921, risk: 'high' as const },
    { name: 'Pouss', lat: 10.851, lng: 15.046, risk: 'critical' as const },
    { name: 'Wina', lat: 10.748, lng: 14.955, risk: 'medium' as const },
    { name: 'Guirvidig', lat: 10.944, lng: 14.700, risk: 'medium' as const },
    { name: 'Yagoua', lat: 10.343, lng: 15.234, risk: 'low' as const },
    { name: 'Kar Hay', lat: 10.920, lng: 14.820, risk: 'high' as const },
];

export default function MapPage() {
    const [floodGeoJSON, setFloodGeoJSON] = useState<GeoJSON.FeatureCollection | null>(null);
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center
                        justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-blue-600" />
                            Carte des inondations
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Étendue actuelle des zones inondées — Maga, Extrême-Nord Cameroun
                        </p>
                    </div>

                    {/* Current risk indicator */}
                    {risk && (
                        <div
                            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold
                          ${RISK_CONFIG[risk.risk_level].bgColor}
                          ${RISK_CONFIG[risk.risk_level].textColor}
                          ${RISK_CONFIG[risk.risk_level].border}`}
                        >
                            {RISK_CONFIG[risk.risk_level].icon} Risque actuel:{' '}
                            {RISK_CONFIG[risk.risk_level].labelFr}
                        </div>
                    )}
                </div>

                {/* Map Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100
                        overflow-hidden mb-6">
                    <LeafletMap
                        floodGeoJSON={floodGeoJSON}
                        villages={VILLAGES}
                    />
                </div>

                {/* Legend and Village List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Map Legend */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-gray-500" />
                            Légende
                        </h3>
                        <div className="space-y-2">
                            <LegendItem color="#2E75B6" opacity={0.5} label="Zone inondée détectée (SAR)" />
                            <LegendItem color="#22c55e" opacity={1} label="Village — Risque faible" dot />
                            <LegendItem color="#eab308" opacity={1} label="Village — Risque modéré" dot />
                            <LegendItem color="#f97316" opacity={1} label="Village — Risque élevé" dot />
                            <LegendItem color="#ef4444" opacity={1} label="Village — Risque critique" dot />
                        </div>
                    </div>

                    {/* Village Risk Table */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-gray-500" />
                            Niveau de risque par village
                        </h3>
                        <div className="space-y-2">
                            {VILLAGES.map((v) => (
                                <div key={v.name}
                                    className="flex items-center justify-between py-1.5
                             border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-700">{v.name}</span>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full
                                ${RISK_CONFIG[v.risk].bgColor}
                                ${RISK_CONFIG[v.risk].textColor}`}
                                    >
                                        {RISK_CONFIG[v.risk].icon} {RISK_CONFIG[v.risk].labelFr}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Data Source Note */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700">
                        <strong>Source des données:</strong> Images radar Sentinel-1 SAR via Google Earth
                        Engine. La détection des inondations utilise la méthode de changement de
                        rétrodiffusion (NDR). Les zones d&apos;eau permanente (Lac Maga, fleuve Logone)
                        sont exclues de l&apos;analyse.
                    </p>
                </div>

            </div>
        </div>
    );
}

function LegendItem({
    color, opacity, label, dot = false,
}: {
    color: string; opacity: number; label: string; dot?: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            {dot ? (
                <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                />
            ) : (
                <div
                    className="w-6 h-4 rounded flex-shrink-0"
                    style={{ backgroundColor: color, opacity }}
                />
            )}
            <span className="text-xs text-gray-600">{label}</span>
        </div>
    );
}