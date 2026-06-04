// src/components/WaterGauge.tsx
'use client';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '@/lib/utils';
import type { WaterLevelReading } from '@/types';

interface Props { data: WaterLevelReading | null; }

export default function WaterGauge({ data }: Props) {
    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-52 gap-3">
                <div className="w-32 h-32 bg-gray-100 rounded-full animate-pulse" />
                <p className="text-sm text-gray-400">Aucune donnée disponible</p>
            </div>
        );
    }

    const fillPct = Math.min(
        Math.max((data.water_area_km2 / data.baseline_area_km2) * 100, 0),
        150
    );

    const gaugeColor =
        fillPct > 130 ? '#ef4444' :
            fillPct > 115 ? '#f97316' :
                fillPct > 100 ? '#eab308' :
                    '#22c55e';

    const statusLabel =
        fillPct > 130 ? 'Critique' :
            fillPct > 115 ? 'Élevé' :
                fillPct > 100 ? 'Au-dessus' :
                    'Normal';

    return (
        <div className="space-y-5">

            {/* Circular Gauge */}
            <div className="flex items-center gap-6">
                <div className="w-36 h-36 flex-shrink-0">
                    <CircularProgressbar
                        value={Math.min(fillPct, 100)}
                        text={`${fillPct.toFixed(0)}%`}
                        styles={buildStyles({
                            rotation: 0.25,
                            strokeLinecap: 'round',
                            textSize: '18px',
                            pathTransitionDuration: 0.8,
                            pathColor: gaugeColor,
                            textColor: '#111827',
                            trailColor: '#e2e8f0',
                        })}
                    />
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                            Statut du lac
                        </p>
                        <p className="text-xl font-bold mt-0.5" style={{ color: gaugeColor }}>
                            {statusLabel}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Stat label="Actuel"
                            value={`${data.water_area_km2.toFixed(0)} km²`} />
                        <Stat label="Normale"
                            value={`${data.baseline_area_km2.toFixed(0)} km²`} />
                    </div>
                    <div className={cn(
                        'rounded-lg px-3 py-2 text-sm font-medium',
                        data.change_percent > 0
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-green-50 text-green-700'
                    )}>
                        {data.change_percent > 0 ? '+' : ''}
                        {data.change_percent.toFixed(1)}% vs normale
                    </div>
                </div>
            </div>

            {/* Bar indicator */}
            <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>0 km²</span>
                    <span>Normale: {data.baseline_area_km2} km²</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-3 rounded-full transition-all duration-700"
                        style={{
                            width: `${Math.min((fillPct / 150) * 100, 100)}%`,
                            backgroundColor: gaugeColor,
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Vide</span>
                    <span>150% de la normale</span>
                </div>
            </div>

        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-gray-50 rounded-lg p-2.5 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{value}</p>
        </div>
    );
}