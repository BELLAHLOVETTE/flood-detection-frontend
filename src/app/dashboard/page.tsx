'use client';

import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/LanguageContext';
import RainfallChart from '@/components/RainfallChart';
import WaterGauge from '@/components/WaterGauge';
import {
    getCurrentRisk, getRainfallSeries,
    getWaterLevel, getSubscriberCount,
} from '@/lib/api';
import { formatNumber, timeAgo } from '@/lib/utils';
import type { TranslationKey } from '@/lib/translations';

// Only risk state carries color — everything else is aqua/neutral.
function riskColor(level: string): string {
    const l = level?.toLowerCase();
    if (['extreme', 'critical', 'high'].includes(l)) return '#c2410c';
    if (['moderate', 'medium'].includes(l)) return '#b45309';
    return 'var(--fw-teal)';
}

export default function DashboardPage() {
    const { locale, t } = useLanguage();

    const { data: risk, isLoading: riskLoading } = useQuery({
        queryKey: ['risk-current'], queryFn: getCurrentRisk, refetchInterval: 30000,
    });
    const { data: rainfall = [], isLoading: rainLoading } = useQuery({
        queryKey: ['rainfall', 90], queryFn: () => getRainfallSeries(90), refetchInterval: 60000,
    });
    const { data: waterLevels = [], isLoading: waterLoading } = useQuery({
        queryKey: ['water-level'], queryFn: () => getWaterLevel(90), refetchInterval: 60000,
    });
    const { data: subscribers } = useQuery({
        queryKey: ['subscriber-count'], queryFn: getSubscriberCount, refetchInterval: 120000,
    });

    const latestWater = waterLevels[0] || null;
    const latestRain = rainfall[0] || null;
    const currentRisk = risk || {
        probability: 0, risk_level: 'low' as const, assessed_at: null,
        model_version: '', risk_color: '', is_escalation: false, is_manual_override: false,
    };

    const pct = (currentRisk.probability * 100).toFixed(0);
    const rc = riskColor(currentRisk.risk_level);
    // Translated risk label (falls back to capitalized raw value if key missing)
    const levelKey = `db.risk.${currentRisk.risk_level.toLowerCase()}` as TranslationKey;
    const levelText = riskLoading
        ? '—'
        : t(levelKey) !== levelKey
            ? t(levelKey)
            : currentRisk.risk_level.charAt(0).toUpperCase() + currentRisk.risk_level.slice(1);

    return (
        <div className="min-h-screen" style={{ background: 'var(--fw-paper)' }}>
            <Navbar />

            {/* ── Header ─────────────────────────────────────── */}
            <div className="border-b" style={{ borderColor: 'var(--fw-line)' }}>
                <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-8">
                    <div className="flex items-end justify-between gap-6 flex-wrap">
                        <div className="fw-rise">
                            <p className="text-[12px] tracking-[0.18em] uppercase mb-2"
                                style={{ color: 'var(--fw-teal)' }}>
                                {t('db.eyebrow')}
                            </p>
                            <h1 className="text-3xl sm:text-[2.2rem] font-semibold tracking-tight leading-none"
                                style={{ color: 'var(--fw-deep)' }}>
                                {t('db.heading')}
                            </h1>
                            <p className="mt-3 text-[13px]" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                                {t('db.updated')} {currentRisk.assessed_at ? timeAgo(currentRisk.assessed_at, locale) : t('db.updated_recently')}
                                {currentRisk.model_version && <> · {t('db.model')} {currentRisk.model_version}</>}
                            </p>
                        </div>

                        {/* Risk dial — the single focal point */}
                        <div className="fw-rise fw-d2 flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-[11px] uppercase tracking-[0.16em]"
                                    style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                                    {t('db.current_risk')}
                                </div>
                                <div className="text-[15px] font-medium mt-0.5" style={{ color: rc }}>
                                    {levelText}
                                </div>
                            </div>
                            <div className="relative w-20 h-20 flex items-center justify-center">
                                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="var(--fw-line)" strokeWidth="6" />
                                    <circle cx="40" cy="40" r="34" fill="none" stroke={rc} strokeWidth="6"
                                        strokeLinecap="round" strokeDasharray={2 * Math.PI * 34}
                                        strokeDashoffset={2 * Math.PI * 34 * (1 - currentRisk.probability)}
                                        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }} />
                                </svg>
                                <span className="text-xl font-semibold tabular-nums" style={{ color: 'var(--fw-deep)' }}>
                                    {riskLoading ? '—' : `${pct}%`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ───────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-10">

                {/* Stat strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 border-y fw-rise"
                    style={{ borderColor: 'var(--fw-line)' }}>
                    {[
                        {
                            label: t('db.stat.prob'),
                            value: riskLoading ? '—' : `${pct}%`,
                            sub: levelText,
                            accent: rc,
                        },
                        {
                            label: t('db.stat.rain'),
                            value: latestRain ? `${latestRain.rainfall_mm.toFixed(1)} mm` : '—',
                            sub: latestRain ? t('db.stat.rain_7d', { val: latestRain.cumulative_7d.toFixed(0) }) : t('db.stat.no_data'),
                        },
                        {
                            label: t('db.stat.lake'),
                            value: latestWater ? `${latestWater.water_area_km2.toFixed(1)} km²` : '—',
                            sub: latestWater
                                ? t('db.stat.vs_normal', { val: `${latestWater.change_percent > 0 ? '+' : ''}${latestWater.change_percent.toFixed(1)}` })
                                : t('db.stat.no_data'),
                        },
                        {
                            label: t('db.stat.subs'),
                            value: subscribers ? formatNumber(subscribers.count) : '—',
                            sub: t('db.stat.verified'),
                        },
                    ].map((s, i) => (
                        <div key={i}
                            className={`px-5 py-6 ${i < 3 ? 'border-r' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''}`}
                            style={{ borderColor: 'var(--fw-line)' }}>
                            <div className="text-[10.5px] uppercase tracking-[0.14em] mb-2.5"
                                style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                {s.label}
                            </div>
                            <div className="text-[1.6rem] font-semibold leading-none tabular-nums"
                                style={{ color: s.accent || 'var(--fw-deep)' }}>
                                {s.value}
                            </div>
                            <div className="text-[12px] mt-2" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                                {s.sub}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <ChartCard title={t('db.chart.rain_title')} caption={t('db.chart.rain_caption')}
                        loading={rainLoading}>
                        <RainfallChart data={rainfall} />
                    </ChartCard>

                    <ChartCard title={t('db.chart.water_title')} caption={t('db.chart.water_caption')}
                        loading={waterLoading}>
                        <WaterGauge data={latestWater} />
                    </ChartCard>
                </div>

                {/* About */}
                <p className="text-[13px] leading-relaxed max-w-3xl"
                    style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                    {t('db.about')}
                    {currentRisk.model_version && <> {t('db.about.model', { val: currentRisk.model_version })}</>}
                </p>
            </div>
        </div>
    );
}

// ── Quiet chart frame ─────────────────────────────────────────
function ChartCard({
    title, caption, loading, children,
}: {
    title: string; caption: string; loading: boolean; children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border overflow-hidden fw-rise"
            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
            <div className="px-6 pt-5 pb-4 flex items-baseline justify-between">
                <h3 className="text-[15px] font-semibold" style={{ color: 'var(--fw-deep)' }}>
                    {title}
                </h3>
                <span className="text-[11px] uppercase tracking-wider"
                    style={{ color: 'var(--fw-teal)' }}>
                    {caption}
                </span>
            </div>
            <div className="px-5 pb-5">
                {loading
                    ? <div className="h-64 rounded-xl animate-pulse" style={{ background: 'var(--fw-mist)' }} />
                    : children}
            </div>
        </div>
    );
}