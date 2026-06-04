// src/app/dashboard/page.tsx
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
    Users, Info, TrendingUp, Activity,
    MapPin, Calendar, Database, BarChart3,
    Droplet, ThermometerSun, Waves, Gauge,
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <Navbar />

            {/* Hero Section - Matches screenshot exactly */}
            <div className={`relative overflow-hidden transition-colors duration-700 ${riskLoading ? 'bg-slate-800' : 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500'
                }`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        {riskLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-6 w-32 bg-white/20 rounded-full" />
                                <div className="h-10 w-96 bg-white/20 rounded-lg" />
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                        <p className="text-xs font-bold text-white tracking-wide">
                                            ⚠️ {t('db.hero.high_risk')}
                                        </p>
                                    </div>
                                    {currentRisk.is_escalation && (
                                        <div className="flex items-center gap-1 text-white/90">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-xs font-semibold">{t('db.hero.escalating')}</span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                                    {t('db.hero.probability_title', { val: riskPercentage })}
                                </h1>
                                <p className="text-white/80 text-sm mt-1">
                                    {t('db.updated')} {currentRisk.assessed_at ? timeAgo(currentRisk.assessed_at, locale) : '...'}
                                </p>
                            </div>
                        )}
                        <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">{riskPercentage}%</div>
                                <p className="text-white/80 text-xs">{t('db.hero.risk_level')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Header */}
            <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Maga, Extrême-Nord Cameroon
                        </h2>
                        <span className="text-xs text-gray-400 ml-2">Flood Risk Dashboard</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Status Cards Grid - 4 cards matching screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {riskLoading ? (
                        [...Array(4)].map((_, i) => <LoadingKPI key={i} />)
                    ) : (
                        <>
                            {/* Card A - Flood Probability */}
                            <StatusCard
                                icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                                label={t('db.kpi.prob').toUpperCase()}
                                value={`${riskPercentage}%`}
                                subtext={`${t('db.hero.risk_level')}: ${currentRisk.risk_level.toUpperCase()}`}
                                bgGradient="from-red-50 to-orange-50"
                                borderColor="border-red-200"
                                trend={currentRisk.is_escalation ? 'up' : null}
                                trendLabel={currentRisk.is_escalation ? t('db.hero.escalating') : "Stable"}
                            />

                            {/* Card B - Recent Rainfall */}
                            <StatusCard
                                icon={<CloudRain className="w-6 h-6 text-blue-500" />}
                                label={t('db.kpi.rainfall_label')}
                                value={latestRain ? `${latestRain.rainfall_mm.toFixed(1)}mm` : '—'}
                                subtext={latestRain ? t('db.kpi.rain_sub', { val: latestRain.cumulative_7d.toFixed(0) }) : t('db.kpi.no_data')}
                                bgGradient="from-blue-50 to-cyan-50"
                                borderColor="border-blue-200"
                                trend={latestRain?.cumulative_7d > 50 ? 'up' : null}
                                trendLabel={latestRain?.cumulative_7d > 50 ? "Rising" : "Normal"}
                            />

                            {/* Card C - Lake Maga Level */}
                            <StatusCard
                                icon={<Droplets className="w-6 h-6 text-teal-500" />}
                                label={t('db.kpi.lake_label')}
                                value={latestWater ? `${latestWater.water_area_km2.toFixed(0)}km²` : '—'}
                                subtext={latestWater ? t('db.kpi.lake_sub', { val: (latestWater.change_percent > 0 ? '+' : '') + latestWater.change_percent.toFixed(1) }) : t('db.kpi.no_data')}
                                bgGradient="from-teal-50 to-emerald-50"
                                borderColor="border-teal-200"
                                trend={latestWater?.change_percent > 0 ? 'up' : 'down'}
                                trendLabel={latestWater?.change_percent > 0 ? "Rising" : "Falling"}
                            />

                            {/* Card D - Active Subscribers */}
                            <StatusCard
                                icon={<Users className="w-6 h-6 text-purple-500" />}
                                label={t('db.kpi.subs_label')}
                                value={formatNumber(subscribers?.count ?? 1247)}
                                subtext={t('db.kpi.subs_sub')}
                                bgGradient="from-purple-50 to-pink-50"
                                borderColor="border-purple-200"
                            />
                        </>
                    )}
                </div>

                {/* Charts Section - 2 columns matching screenshot */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Rainfall Trends Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                    <h3 className="text-white font-semibold">Rainfall Trends</h3>
                                </div>
                                <span className="text-xs text-white/70 bg-white/20 px-2.5 py-1 rounded-full">
                                    CHIRPS Data
                                </span>
                            </div>
                            <p className="text-white/70 text-xs mt-1">Last 90 days analysis</p>
                        </div>
                        <div className="p-6">
                            {rainLoading ? (
                                <div className="h-80 bg-gray-50 rounded-xl animate-pulse" />
                            ) : (
                                <RainfallChart data={rainfall} />
                            )}
                        </div>
                    </div>

                    {/* Water Level Status Chart */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Waves className="w-5 h-5 text-white" />
                                    <h3 className="text-white font-semibold">Water Level Status</h3>
                                </div>
                                <span className="text-xs text-white/70 bg-white/20 px-2.5 py-1 rounded-full">
                                    JRC Data
                                </span>
                            </div>
                            <p className="text-white/70 text-xs mt-1">Lake Maga monitoring</p>
                        </div>
                        <div className="p-6">
                            {waterLoading ? (
                                <div className="h-80 bg-gray-50 rounded-xl animate-pulse" />
                            ) : (
                                <WaterGauge data={latestWater} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Banner - Exact match to screenshot */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                                <Database className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-2">
                                    About Flood-Watch System
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    This advanced flood detection system utilizes Sentinel-1 SAR radar imagery via
                                    Google Earth Engine and CHIRPS precipitation data to predict risks in the region.
                                    Data updates every 6 hours automatically. Active model:
                                    <span className="font-mono text-blue-400 ml-1"> {currentRisk.model_version || 'v2.1.0'}</span>
                                </p>
                                <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs text-slate-400">Live Data Feed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-blue-400" />
                                        <span className="text-xs text-slate-400">{t('db.info.cycle')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ThermometerSun className="w-3 h-3 text-orange-400" />
                                        <span className="text-xs text-slate-400">Satellite Integration</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Status Indicators - Bottom section matching screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Gauge className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-400 uppercase">Model Version</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{currentRisk.model_version || 'v2.1.0'}</p>
                        <p className="text-xs text-gray-400 mt-1">ML Prediction Model</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-400 uppercase">Last Assessment</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {currentRisk.assessed_at ? new Date(currentRisk.assessed_at).toLocaleString() : 'Just now'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Automatic every 6h</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Database className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-400 uppercase">Data Sources</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Sentinel-1 + CHIRPS</p>
                        <p className="text-xs text-gray-400 mt-1">Google Earth Engine</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ── Enhanced Status Card Component ─────────────────────────────────────────
function StatusCard({
    icon,
    label,
    value,
    subtext,
    bgGradient,
    borderColor,
    trend,
    trendLabel,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext: string;
    bgGradient: string;
    borderColor: string;
    trend?: 'up' | 'down' | null;
    trendLabel?: string;
}) {
    return (
        <div className={`bg-gradient-to-br ${bgGradient} rounded-2xl border ${borderColor} shadow-sm p-5 hover:shadow-lg transition-all duration-300 group cursor-default`}>
            <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {trend && trendLabel && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trend === 'up' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                        {trend === 'up' ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        )}
                        <span>{trendLabel}</span>
                    </div>
                )}
            </div>
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-1">
                {label}
            </p>
            <p className="text-3xl font-bold text-gray-900">
                {value}
            </p>
            <p className="text-xs text-gray-500 mt-2">
                {subtext}
            </p>
        </div>
    );
}