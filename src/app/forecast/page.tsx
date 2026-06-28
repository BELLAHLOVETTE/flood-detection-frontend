'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { apiClient } from '@/lib/api';
import type { FloodRiskForecastResponse } from '@/lib/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

// Risk → single functional color. No emoji, no rainbow.
const RISK_COLOR: Record<string, string> = {
    low: 'var(--fw-teal)',
    medium: '#b45309',
    high: '#c2410c',
    critical: '#991b1b',
};
const RISK_LABEL: Record<string, string> = {
    low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
};

export default function ForecastPage() {
    // Demo toggle: blank = live data, or a rainy-season date for presentations
    const [demoDate, setDemoDate] = useState<string>('');

    const { data, isLoading, error, refetch, isFetching } =
        useQuery<FloodRiskForecastResponse>({
            queryKey: ['flood-risk-forecast', demoDate],
            queryFn: () =>
                apiClient
                    .get(`/forecast/flood-risk/${demoDate ? `?demo_date=${demoDate}` : ''}`)
                    .then(r => r.data),
            refetchInterval: 1000 * 60 * 30,
            retry: 2,
        });

    const forecast = data?.forecast ?? [];
    const peak = data?.peak_risk_day;
    const peakColor = peak ? (RISK_COLOR[peak.risk_level] ?? 'var(--fw-teal)') : 'var(--fw-teal)';

    return (
        <div className="min-h-screen" style={{ background: 'var(--fw-paper)' }}>
            <Navbar />

            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

                {/* Header */}
                <div className="flex items-end justify-between gap-6 flex-wrap mb-8 fw-rise">
                    <div>
                        <p className="text-[12px] tracking-[0.18em] uppercase mb-2"
                            style={{ color: 'var(--fw-teal)' }}>
                            7-day outlook · Maga
                        </p>
                        <h1 className="text-3xl sm:text-[2.2rem] font-semibold tracking-tight leading-none"
                            style={{ color: 'var(--fw-deep)' }}>
                            Flood risk forecast
                        </h1>
                        <p className="mt-3 text-[13px]" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                            {data?.generated_at
                                ? `Generated ${new Date(data.generated_at).toLocaleString('en-GB')}`
                                : 'Loading…'}
                            {data?.model_used && <> · {data.model_used}</>}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Demo scenario toggle */}
                        <select
                            value={demoDate}
                            onChange={e => setDemoDate(e.target.value)}
                            className="text-[13px] rounded-full border px-4 py-2 bg-transparent outline-none transition-colors"
                            style={{ borderColor: 'var(--fw-line)', color: 'var(--fw-deep)' }}
                        >
                            <option value="">Live data</option>
                            <option value="2025-08-20">Demo · rainy season</option>
                            <option value="2025-09-15">Demo · peak season</option>
                        </select>
                        <button
                            onClick={() => refetch()}
                            className="text-[13px] rounded-full border px-4 py-2 transition-colors hover:bg-[var(--fw-mist)]"
                            style={{ borderColor: 'var(--fw-line)', color: 'var(--fw-deep)' }}
                        >
                            <span className={isFetching ? 'inline-block animate-spin' : ''}>↻</span> Refresh
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border px-5 py-4 mb-8 text-[14px]"
                        style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
                        Couldn’t load the forecast. Check your connection and try Refresh.
                    </div>
                )}

                {/* Peak callout — only when genuinely elevated */}
                {peak && (peak.risk_level === 'high' || peak.risk_level === 'critical') && (
                    <div className="rounded-2xl px-6 py-5 mb-9 fw-rise"
                        style={{ background: 'var(--fw-deep)' }}>
                        <div className="flex items-start gap-4">
                            <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full"
                                style={{ background: peakColor }} />
                            <div>
                                <p className="text-white font-medium">
                                    Peak {RISK_LABEL[peak.risk_level]} risk · {peak.day_label} {peak.forecast_date}
                                </p>
                                <p className="text-white/65 text-[14px] mt-1">
                                    {((peak.probability ?? 0) * 100).toFixed(0)}% flood probability ·{' '}
                                    {Number(peak.predicted_rain ?? 0).toFixed(0)} mm predicted rainfall.{' '}
                                    {peak.risk_level === 'critical'
                                        ? 'Preparation and possible evacuation may be needed.'
                                        : 'Residents and authorities should stay alert.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Day strip — hairline cells, animated in */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px rounded-2xl overflow-hidden mb-10"
                    style={{ background: 'var(--fw-line)' }}>
                    {isLoading
                        ? [...Array(7)].map((_, i) => (
                            <div key={i} className="h-36 animate-pulse" style={{ background: 'var(--fw-mist)' }} />
                        ))
                        : forecast.map((day, index) => {
                            const color = RISK_COLOR[day.risk_level] ?? 'var(--fw-teal)';
                            const isPeak = peak?.forecast_date === day.forecast_date;
                            const prob = day.probability ?? 0;
                            const rain = day.predicted_rain ?? day.predicted_mm ?? 0;
                            return (
                                <div key={day.forecast_date}
                                    className={`p-4 text-center fw-rise fw-d${Math.min(index + 1, 4)}`}
                                    style={{ background: isPeak ? 'var(--fw-mist)' : 'var(--fw-paper)' }}>
                                    <p className="text-[10.5px] uppercase tracking-[0.1em]"
                                        style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                                        {index === 0 ? 'Tomorrow' : day.day_label.slice(0, 3)}
                                    </p>
                                    <p className="text-[11px] mb-3" style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                                        {new Date(day.forecast_date).toLocaleDateString('en-GB',
                                            { day: '2-digit', month: '2-digit' })}
                                    </p>
                                    {/* probability ring */}
                                    <div className="relative w-12 h-12 mx-auto mb-3">
                                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                                            <circle cx="24" cy="24" r="20" fill="none"
                                                stroke="var(--fw-line)" strokeWidth="4" />
                                            <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="4"
                                                strokeLinecap="round" strokeDasharray={2 * Math.PI * 20}
                                                strokeDashoffset={2 * Math.PI * 20 * (1 - prob)}
                                                style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }} />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold tabular-nums"
                                            style={{ color: 'var(--fw-deep)' }}>
                                            {(prob * 100).toFixed(0)}
                                        </span>
                                    </div>
                                    <p className="text-[12px] font-medium" style={{ color }}>
                                        {RISK_LABEL[day.risk_level] ?? 'Low'}
                                    </p>
                                    <p className="text-[11.5px] mt-1" style={{ color: 'var(--fw-teal)' }}>
                                        {Number(rain).toFixed(0)} mm
                                    </p>
                                    {isPeak && (
                                        <p className="text-[9px] uppercase tracking-[0.12em] mt-2"
                                            style={{ color: peakColor }}>Peak</p>
                                    )}
                                </div>
                            );
                        })}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                    <ChartFrame title="Flood probability" caption="% per day">
                        {isLoading
                            ? <Skel />
                            : (
                                <ResponsiveContainer width="100%" height={210}>
                                    <BarChart data={forecast.map(d => ({
                                        name: d.day_label.slice(0, 3),
                                        value: Math.round((d.probability ?? 0) * 100),
                                    }))} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="2 4" stroke="var(--fw-line)" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7a8c8e' }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#7a8c8e' }}
                                            tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
                                        <Tooltip formatter={(v) => [`${Number(v).toFixed(0)}%`, 'Probability']}
                                            contentStyle={{ borderRadius: 12, border: '1px solid var(--fw-line)', fontSize: 12 }} />
                                        <ReferenceLine y={30} stroke="#b45309" strokeDasharray="3 3"
                                            label={{ value: 'Medium', fontSize: 9, fill: '#b45309' }} />
                                        <ReferenceLine y={60} stroke="#c2410c" strokeDasharray="3 3"
                                            label={{ value: 'High', fontSize: 9, fill: '#c2410c' }} />
                                        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                                            {forecast.map((d, i) => (
                                                <Cell key={i} fill={RISK_COLOR[d.risk_level] ?? 'var(--fw-teal)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                    </ChartFrame>

                    <ChartFrame title="Predicted rainfall" caption="mm per day">
                        {isLoading
                            ? <Skel />
                            : (
                                <ResponsiveContainer width="100%" height={210}>
                                    <BarChart data={forecast.map(d => ({
                                        name: d.day_label.slice(0, 3),
                                        rain: Number((d.predicted_rain ?? d.predicted_mm ?? 0).toFixed(1)),
                                    }))} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
                                        <CartesianGrid strokeDasharray="2 4" stroke="var(--fw-line)" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7a8c8e' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#7a8c8e' }} axisLine={false} tickLine={false} />
                                        <Tooltip formatter={(v) => [`${Number(v).toFixed(1)} mm`, 'Rainfall']}
                                            contentStyle={{ borderRadius: 12, border: '1px solid var(--fw-line)', fontSize: 12 }} />
                                        <Bar dataKey="rain" fill="var(--fw-teal)" radius={[5, 5, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                    </ChartFrame>
                </div>

                {/* Methodology — quiet prose, not a boxed banner */}
                <div className="border-t pt-7" style={{ borderColor: 'var(--fw-line)' }}>
                    <p className="text-[11px] uppercase tracking-[0.16em] mb-3"
                        style={{ color: 'var(--fw-teal)' }}>
                        How this forecast is made
                    </p>
                    <p className="text-[13.5px] leading-relaxed max-w-3xl"
                        style={{ color: 'var(--fw-ink)', opacity: 0.7 }}>
                        Flood probability combines a Random Forest model trained on 25 years of CHIRPS
                        rainfall (2000–2025) with a seasonal climatology baseline for Maga. Daily rainfall
                        estimates use CHIRPS historical averages for the time of year. Sources: NOAA GFS,
                        CHIRPS, Sentinel-1 SAR, JRC water extent.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ChartFrame({ title, caption, children }: {
    title: string; caption: string; children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border overflow-hidden fw-rise"
            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
            <div className="px-6 pt-5 pb-3 flex items-baseline justify-between">
                <h3 className="text-[15px] font-semibold" style={{ color: 'var(--fw-deep)' }}>{title}</h3>
                <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--fw-teal)' }}>
                    {caption}
                </span>
            </div>
            <div className="px-4 pb-5">{children}</div>
        </div>
    );
}

function Skel() {
    return <div className="h-52 rounded-xl animate-pulse" style={{ background: 'var(--fw-mist)' }} />;
}