// src/components/WaterGauge.tsx
'use client';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { cn } from '@/lib/utils';
import type { WaterLevelReading } from '@/types';
import { useLanguage } from '@/lib/LanguageContext';

interface Props { data: WaterLevelReading | null; }

const GAUGE_COLORS = {
    critical: 'var(--color-red-500)',
    high: 'var(--color-orange-500)',
    above: 'var(--color-yellow-500)',
    normal: 'var(--color-green-500)',
    trail: 'var(--color-slate-100)',
};

export default function WaterGauge({ data }: Props) {
    const { t } = useLanguage();

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-52 gap-3">
                <div className="w-32 h-32 bg-gray-100 rounded-full animate-pulse" />
                <p className="text-sm text-gray-400">{t('gauge.no_data')}</p>
            </div>
        );
    }

    const fillPct = Math.min(
        Math.max((data.water_area_km2 / data.baseline_area_km2) * 100, 0),
        150
    );

    const gaugeColor =
        fillPct > 130 ? GAUGE_COLORS.critical :
            fillPct > 115 ? GAUGE_COLORS.high :
                fillPct > 100 ? GAUGE_COLORS.above :
                    GAUGE_COLORS.normal;

    const statusLabel =
        fillPct > 130 ? t('gauge.level.critical') :
            fillPct > 115 ? t('gauge.level.high') :
                fillPct > 100 ? t('gauge.level.above') :
                    t('gauge.level.normal');

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
                            textColor: 'var(--color-slate-900)',
                            trailColor: GAUGE_COLORS.trail,
                        })}
                    />
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                            {t('gauge.status')}
                        </p>
                        <p className="text-xl font-bold mt-0.5" style={{ color: gaugeColor }}>
                            {statusLabel}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Stat label={t('gauge.actual')}
                            value={`${data.water_area_km2.toFixed(0)} km²`} />
                        <Stat label={t('gauge.normal')}
                            value={`${data.baseline_area_km2.toFixed(0)} km²`} />
                    </div>
                    <div className={cn(
                        'rounded-lg px-3 py-2 text-sm font-medium',
                        data.change_percent > 0
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-green-50 text-green-700'
                    )}>
                        {data.change_percent > 0 ? '+' : ''}
                        {data.change_percent.toFixed(1)}% {t('gauge.vs_normal')}
                    </div>
                </div>
            </div>

            {/* Bar indicator */}
            <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>0 km²</span>
                    <span>{t('gauge.normal')}: {data.baseline_area_km2} km²</span>
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
                    <span>{t('gauge.empty')}</span>
                    <span>{t('gauge.max_percent')}</span>
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