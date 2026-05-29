// src/components/WaterGauge.tsx
'use client';
import { cn } from '@/lib/utils';
import type { WaterLevelReading } from '@/types';

interface Props {
    data: WaterLevelReading | null;
}

export default function WaterGauge({ data }: Props) {
    if (!data) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                Aucune donnée disponible
            </div>
        );
    }

    const fillPercent = Math.min(data.fill_percentage, 150);
    const isAboveBaseline = data.change_percent > 0;

    // Colour depends on how full the lake is
    const barColor =
        fillPercent > 130 ? '#ef4444' :
            fillPercent > 110 ? '#f97316' :
                fillPercent > 90 ? '#eab308' :
                    '#22c55e';

    return (
        <div className="space-y-4">
            {/* Main gauge bar */}
            <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Niveau actuel</span>
                    <span>{data.water_area_km2.toFixed(0)} km²</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                        className="h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{
                            width: `${Math.min(fillPercent, 100)}%`,
                            backgroundColor: barColor,
                        }}
                    >
                        <span className="text-white text-xs font-bold">
                            {fillPercent.toFixed(0)}%
                        </span>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0 km²</span>
                    <span>Normale: {data.baseline_area_km2} km²</span>
                    <span>150%</span>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Actuel</p>
                    <p className="text-lg font-bold text-gray-900">
                        {data.water_area_km2.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400">km²</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Normale</p>
                    <p className="text-lg font-bold text-gray-900">
                        {data.baseline_area_km2.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-400">km²</p>
                </div>
                <div
                    className={cn(
                        'rounded-lg p-3 text-center',
                        isAboveBaseline ? 'bg-orange-50' : 'bg-green-50'
                    )}
                >
                    <p className="text-xs text-gray-500">Variation</p>
                    <p
                        className={cn(
                            'text-lg font-bold',
                            isAboveBaseline ? 'text-orange-600' : 'text-green-600'
                        )}
                    >
                        {isAboveBaseline ? '+' : ''}
                        {data.change_percent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-400">vs normale</p>
                </div>
            </div>
        </div>
    );
}