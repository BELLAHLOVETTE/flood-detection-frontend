// src/app/forecast/page.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { getFloodRiskForecast } from '@/lib/api';
import type { FloodRiskForecastResponse, ForecastDay } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import {
    TrendingUp, AlertTriangle, CloudRain,
    Info, Calendar, Zap, Clock,
} from 'lucide-react';

// Risk level display config — same pattern as types/index.ts
const RISK = {
    low: { label: 'Low', color: '#22c55e', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', icon: '🟢' },
    medium: { label: 'Medium', color: '#eab308', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', icon: '🟡' },
    high: { label: 'High', color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', icon: '🟠' },
    critical: { label: 'Critical', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-400', icon: '🔴' },
} as const;

type RiskKey = keyof typeof RISK;

export default function ForecastPage() {
    const { data, isLoading, error, refetch } = useQuery<FloodRiskForecastResponse>({
        queryKey: ['flood-risk-forecast'],
        queryFn: getFloodRiskForecast,
        refetchInterval: 1000 * 60 * 30, // every 30 minutes
        retry: 2,
    });

    const forecast = data?.forecast ?? [];
    const peak = data?.peak_risk_day;
    const peakCfg = peak ? RISK[peak.risk_level as RiskKey] : null;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                            7-Day Flood Risk Forecast
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Maga Sub-Division, Far North Cameroon ·{' '}
                            {data?.generated_at
                                ? new Date(data.generated_at).toLocaleString('en-GB')
                                : 'Loading...'}
                        </p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500
                       bg-white border border-gray-200 rounded-xl hover:bg-gray-50
                       transition-colors"
                    >
                        <Clock className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-red-700">
                            Unable to load forecast. Please check your connection and try again.
                        </p>
                    </div>
                )}

                {/* Peak risk alert banner */}
                {peak && peakCfg && (peak.risk_level === 'high' || peak.risk_level === 'critical') && (
                    <div className={cn(
                        'rounded-2xl border-2 p-5 mb-8 flex items-start gap-4',
                        peakCfg.bg, peakCfg.border
                    )}>
                        <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                            peak.risk_level === 'critical' ? 'bg-red-200' : 'bg-orange-200'
                        )}>
                            <Zap className={cn('w-6 h-6', peakCfg.text)} />
                        </div>
                        <div>
                            <p className={cn('text-base font-bold', peakCfg.text)}>
                                ⚠️ Peak {peakCfg.label} Risk on{' '}
                                {peak.day_label} ({peak.forecast_date})
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                Flood probability:{' '}
                                <strong>{((peak.probability ?? 0) * 100).toFixed(0)}%</strong>
                                {' · '}
                                Predicted rainfall:{' '}
                                <strong>{peak.predicted_rain ?? 0} mm</strong>.{' '}
                                {peak.risk_level === 'critical'
                                    ? 'Immediate preparation and evacuation may be necessary.'
                                    : 'Residents and authorities should remain on high alert.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* 7-day cards */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4
                         flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Day-by-Day Risk
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {[...Array(7)].map((_, i) => (
                                <div key={i}
                                    className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {forecast.map((day, index) => {
                                const cfg = RISK[day.risk_level as RiskKey] ?? RISK.low;
                                const isPeak = peak?.forecast_date === day.forecast_date;
                                const prob = day.probability ?? 0;
                                const rain = day.predicted_rain ?? day.predicted_mm ?? 0;

                                return (
                                    <div
                                        key={day.forecast_date}
                                        className={cn(
                                            'rounded-2xl border-2 p-4 text-center transition-all',
                                            'hover:shadow-md hover:-translate-y-0.5 duration-200',
                                            isPeak
                                                ? `${cfg.bg} ${cfg.border} shadow-md`
                                                : 'bg-white border-gray-100 hover:border-gray-200'
                                        )}
                                    >
                                        {isPeak && (
                                            <div className="text-xs font-bold text-red-500 mb-1">
                                                PEAK RISK
                                            </div>
                                        )}
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                            {index === 0 ? 'Tomorrow' : day.day_label}
                                        </p>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {new Date(day.forecast_date).toLocaleDateString('en-GB', {
                                                day: '2-digit', month: '2-digit'
                                            })}
                                        </p>
                                        <div className="text-3xl mb-2">{cfg.icon}</div>
                                        <p className={cn('text-xs font-bold', cfg.text)}>
                                            {cfg.label}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {(prob * 100).toFixed(0)}% risk
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium mt-1">
                                            {Number(rain).toFixed(0)} mm
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Flood probability chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            Flood Probability (%)
                        </h3>
                        {isLoading ? (
                            <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={forecast.map(d => ({
                                        name: d.day_label.slice(0, 3),
                                        value: Math.round((d.probability ?? 0) * 100),
                                        color: d.risk_color,
                                    }))}
                                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={v => `${v}%`}
                                    />
                                    <Tooltip
                                        formatter={(v) => [`${Number(v).toFixed(0)}%`, 'Flood Probability']}
                                    />
                                    <ReferenceLine
                                        y={60}
                                        stroke="#f97316"
                                        strokeDasharray="4 4"
                                        label={{ value: 'Alert', fontSize: 10, fill: '#f97316' }}
                                    />
                                    <ReferenceLine
                                        y={80}
                                        stroke="#ef4444"
                                        strokeDasharray="4 4"
                                        label={{ value: 'Critical', fontSize: 10, fill: '#ef4444' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {forecast.map((d, i) => (
                                            <Cell key={i} fill={d.risk_color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Rainfall forecast chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-blue-500" />
                            Predicted Rainfall (mm/day)
                        </h3>
                        {isLoading ? (
                            <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={forecast.map(d => ({
                                        name: d.day_label.slice(0, 3),
                                        rain: Number((d.predicted_rain ?? d.predicted_mm ?? 0).toFixed(1)),
                                    }))}
                                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        formatter={(v) => [`${Number(v).toFixed(1)} mm`, 'Predicted Rain']}
                                    />
                                    <ReferenceLine
                                        y={25}
                                        stroke="#eab308"
                                        strokeDasharray="4 4"
                                        label={{ value: '25mm', fontSize: 10, fill: '#eab308' }}
                                    />
                                    <ReferenceLine
                                        y={50}
                                        stroke="#f97316"
                                        strokeDasharray="4 4"
                                        label={{ value: '50mm', fontSize: 10, fill: '#f97316' }}
                                    />
                                    <Bar dataKey="rain" fill="#2E75B6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                </div>

                {/* Methodology note */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Forecast Methodology
                            </p>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                Flood probability is estimated by combining a Random Forest ML model
                                (trained on 25 years of CHIRPS data 2000–2025) with a seasonal
                                climatology baseline for the Maga region. Rainfall predictions use
                                CHIRPS historical averages for the current time of year blended with
                                recent 14-day trends. Forecasts are refreshed every 24 hours.
                                Source: <strong>NOAA GFS · CHIRPS · Sentinel-1 SAR · JRC Water</strong>.
                            </p>
                            {data?.generated_at && (
                                <p className="text-xs text-gray-400 mt-2">
                                    Last updated:{' '}
                                    {new Date(data.generated_at).toLocaleString('en-GB')}
                                    {' · '}Model: {data.model_used}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}