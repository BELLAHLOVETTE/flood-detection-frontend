'use client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/LanguageContext';
import RainfallChart from '@/components/RainfallChart';
import WaterGauge from '@/components/WaterGauge';
import { LiveRiskBanner } from '@/components/LiveRiskBanner';
import { LoadingKPI, LoadingCard } from '@/components/LoadingCard';
import {
    getCurrentRisk, getRainfallSeries,
    getWaterLevel, getSubscriberCount,
} from '@/lib/api';
import { formatNumber, timeAgo } from '@/lib/utils';
import {
    AlertTriangle, CloudRain, Droplets,
    Users, TrendingUp, Activity,
    MapPin, Calendar, Database, BarChart3,
    ThermometerSun, Waves, Gauge, Zap, Clock,
} from 'lucide-react';

export default function DashboardPage() {
    const { t, locale } = useLanguage();

    const { data: risk, isLoading: riskLoading } = useQuery({
        queryKey: ['risk-current'],
        queryFn: getCurrentRisk,
        refetchInterval: 30000,
    });

    const { data: rainfall = [], isLoading: rainLoading } = useQuery({
        queryKey: ['rainfall', 90],
        queryFn: () => getRainfallSeries(90),
        refetchInterval: 60000,
    });

    const { data: waterLevels = [], isLoading: waterLoading } = useQuery({
        queryKey: ['water-level'],
        queryFn: () => getWaterLevel(90),
        refetchInterval: 60000,
    });

    const { data: subscribers } = useQuery({
        queryKey: ['subscriber-count'],
        queryFn: getSubscriberCount,
        refetchInterval: 120000,
    });

    const latestWater = waterLevels[0] || null;
    const latestRain = rainfall[0] || null;
    const currentRisk = risk || {
        probability: 0,
        risk_level: 'low' as const,
        assessed_at: null,
        model_version: 'v2.1.0',
        risk_color: 'var(--color-green-500)',
        is_escalation: false,
        is_manual_override: false,
    };

    const riskPercentage = (currentRisk.probability * 100).toFixed(0);

    // Dynamic styling based on risk level
    const getRiskTheme = (level: string) => {
        const l = level?.toLowerCase();
        switch (l) {
            case 'extreme':
            case 'critical':
            case 'high':
                return {
                    bg: 'bg-red-500',
                    text: 'text-red-500',
                    lightBg: 'bg-red-50',
                    border: 'border-red-100',
                    bannerBg: 'bg-red-50',
                    bannerText: 'text-red-700',
                    bannerIcon: 'text-red-500',
                    badge: 'HIGH RISK ALERT'
                };
            case 'moderate':
            case 'medium':
                return {
                    bg: 'bg-orange-500',
                    text: 'text-orange-500',
                    lightBg: 'bg-orange-50',
                    border: 'border-orange-100',
                    bannerBg: 'bg-orange-50',
                    bannerText: 'text-orange-700',
                    bannerIcon: 'text-orange-500',
                    badge: 'MODERATE RISK'
                };
            default: // low
                return {
                    bg: 'bg-blue-600',
                    text: 'text-blue-600',
                    lightBg: 'bg-blue-50',
                    border: 'border-blue-100',
                    bannerBg: 'bg-blue-50',
                    bannerText: 'text-blue-700',
                    bannerIcon: 'text-blue-500',
                    badge: 'LOW RISK'
                };
        }
    };

    const theme = getRiskTheme(currentRisk.risk_level);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* ── HIGH RISK ALERT BANNER ── */}
            {!riskLoading && (
                <div className={`${theme.bannerBg} border-b ${theme.border}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 ${theme.lightBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                {currentRisk.risk_level === 'low' ? <Waves className={`w-4 h-4 ${theme.bannerIcon}`} /> : <AlertTriangle className={`w-4 h-4 ${theme.bannerIcon}`} />}
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${theme.bannerText}`}>
                                    {currentRisk.risk_level === 'low' ? '🌊' : '⚠️'} {theme.badge}
                                </p>
                                <p className={`text-xs ${theme.text}`}>
                                    Flood probability: {riskPercentage}% • Maga Region
                                    {currentRisk.is_escalation && ' Escalating'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── HERO / PAGE HEADER ── */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-start justify-between gap-6">
                        {/* Left: title block */}
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-blue-600 font-medium">
                                    Maga, Extrême-Nord Cameroon
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                Flood Risk Dashboard
                            </h1>
                            <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="text-xs">
                                    Updated {currentRisk.assessed_at ? timeAgo(currentRisk.assessed_at, locale) : '15 min ago'}
                                </span>
                            </div>
                        </div>

                        {/* Right: Risk Level card */}
                        <div className="flex-shrink-0 border border-gray-200 rounded-xl overflow-hidden shadow-sm text-center min-w-[120px]">
                            <div className={`${theme.bg} px-4 py-1.5`}>
                                <p className="text-white text-[10px] font-bold tracking-widest uppercase">
                                    Risk Level
                                </p>
                            </div>
                            <div className="bg-white px-4 py-3">
                                <p className={`text-4xl font-extrabold ${theme.text} leading-none`}>
                                    {riskLoading ? '—' : `${riskPercentage}%`}
                                </p>
                                <p className={`text-xs font-bold ${theme.text} uppercase mt-0.5`}>
                                    {currentRisk.risk_level}
                                </p>
                            </div>
                            <div className="bg-gray-50 border-t border-gray-100 px-3 py-1.5">
                                <span className="text-[10px] text-gray-400 font-mono">
                                    Model {currentRisk.model_version || 'v2.1.0'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* ── KPI CARDS GRID (4 cards) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {riskLoading ? (
                        [...Array(4)].map((_, i) => <LoadingKPI key={i} />)
                    ) : (
                        <>
                            {/* Card A – Flood Probability */}
                            <KpiCard
                                icon={currentRisk.risk_level === 'low' ? <Waves className={`w-5 h-5 ${theme.text}`} /> : <AlertTriangle className={`w-5 h-5 ${theme.text}`} />}
                                iconBg={theme.lightBg}
                                label={t('db.kpi.prob') || 'FLOOD PROBABILITY'}
                                value={`${riskPercentage}%`}
                                subtext={`Risk Level: ${currentRisk.risk_level.charAt(0).toUpperCase() + currentRisk.risk_level.slice(1)}`}
                                trend={currentRisk.is_escalation ? 'up' : null}
                                trendLabel={currentRisk.is_escalation ? 'Escalating' : 'Stable'}
                            />

                            {/* Card B – Recent Rainfall */}
                            <KpiCard
                                icon={<CloudRain className="w-5 h-5 text-blue-400" />}
                                iconBg="bg-blue-50"
                                label={t('db.kpi.rainfall_label') || 'RECENT RAINFALL'}
                                value={latestRain ? `${latestRain.rainfall_mm.toFixed(1)}` : '—'}
                                subtext={latestRain
                                    ? `7-day: ${latestRain.cumulative_7d.toFixed(0)}mm`
                                    : t('db.kpi.no_data') || 'No data'}
                                trend={latestRain?.cumulative_7d > 50 ? 'up' : null}
                                trendLabel={latestRain?.cumulative_7d > 50 ? 'Rising' : 'Normal'}
                            />

                            {/* Card C – Lake Maga Level */}
                            <KpiCard
                                icon={<Droplets className="w-5 h-5 text-teal-400" />}
                                iconBg="bg-teal-50"
                                label={t('db.kpi.lake_label') || 'LAKE MAGA LEVEL'}
                                value={latestWater ? `${latestWater.water_area_km2.toFixed(1)}km²` : '—'}
                                subtext={latestWater
                                    ? `${latestWater.change_percent > 0 ? '+' : ''}${latestWater.change_percent.toFixed(1)}% vs normal`
                                    : t('db.kpi.no_data') || 'No data'}
                                trend={latestWater?.change_percent > 0 ? 'up' : 'down'}
                                trendLabel={latestWater?.change_percent > 0 ? 'Rising' : 'Falling'}
                            />

                            {/* Card D – Active Subscribers */}
                            <KpiCard
                                icon={<Users className="w-5 h-5 text-purple-400" />}
                                iconBg="bg-purple-50"
                                label={t('db.kpi.subs_label') || 'ACTIVE SUBSCRIBERS'}
                                value={formatNumber(subscribers?.count ?? 1247)}
                                subtext={t('db.kpi.subs_sub') || 'Verified subscribers'}
                            />
                        </>
                    )}
                </div>

                {/* ── CHARTS ROW ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Rainfall Trends */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    Rainfall Trends
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">Last 90 days analysis</p>
                            </div>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                                CHIRPS Data
                            </span>
                        </div>
                        <div className="p-6">
                            {rainLoading ? (
                                <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
                            ) : (
                                <RainfallChart data={rainfall} />
                            )}
                        </div>
                    </div>

                    {/* Water Level Status */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    Water Level Status
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">Lake Maga monitoring</p>
                            </div>
                            <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                                JRC Data
                            </span>
                        </div>
                        <div className="p-6">
                            {waterLoading ? (
                                <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
                            ) : (
                                <WaterGauge data={latestWater} />
                            )}
                        </div>
                    </div>
                </div>

                {/* ── ABOUT BANNER ── */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-1">
                                About Flood-Watch System
                            </h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                This advanced flood detection system utilizes Sentinel-1 SAR radar imagery via
                                Google Earth Engine and CHIRPS precipitation data to predict risks in Maga region
                                (Extrême-Nord Cameroon). Data updates every 6 hours automatically. Active model:{' '}
                                <span className="font-mono font-semibold text-blue-600">
                                    {currentRisk.model_version || 'v2.1.0'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ── KPI Card Component ─────────────────────────────────────────────────────
function KpiCard({
    icon,
    iconBg,
    label,
    value,
    subtext,
    trend,
    trendLabel,
}: {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string;
    subtext: string;
    trend?: 'up' | 'down' | null;
    trendLabel?: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
            {/* Icon row + trend badge */}
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
                {trend && trendLabel && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${trend === 'up'
                        ? 'text-red-500'
                        : 'text-green-600'
                        }`}>
                        <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
                        <span>{trendLabel}</span>
                    </div>
                )}
            </div>

            {/* Label */}
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
                {label}
            </p>

            {/* Value */}
            <p className="text-3xl font-extrabold text-gray-900 leading-tight">
                {value}
            </p>

            {/* Subtext */}
            <p className="text-xs text-gray-400 mt-1.5">
                {subtext}
            </p>
        </div>
    );
}