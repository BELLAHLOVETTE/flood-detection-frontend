// src/app/admin/page.tsx
'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import {
    getCurrentRisk, getRainfallSeries, getWaterLevel,
    getSubscriberCount, getAlertHistory, getSystemHealth,
    apiClient,
} from '@/lib/api';
import { RISK_CONFIG, type RiskLevel } from '@/types';
import { formatDate, timeAgo, formatNumber } from '@/lib/utils';
import { LoadingKPI } from '@/components/LoadingCard';
import toast from 'react-hot-toast';
import {
    Shield, AlertTriangle, Users, Activity,
    Send, CheckCircle, Clock, Database,
    CloudRain, Droplets, RefreshCw, Bell,
    BarChart3, Cpu, Wifi,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ── API helpers ───────────────────────────────────────────────────────────────
const dispatchManualAlert = (data: {
    risk_level: string;
    message_fr: string;
    message_en: string;
}) => apiClient.post('/admin/alerts/dispatch/', data).then(r => r.data);

export default function AdminPage() {
    const { t, locale } = useLanguage();
    const queryClient = useQueryClient();

    // Form state for manual alert
    const [alertLevel, setAlertLevel] = useState<RiskLevel>('high');
    const [messageFr, setMessageFr] = useState('');
    const [messageEn, setMessageEn] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    // Queries
    const { data: risk } = useQuery({ queryKey: ['risk-current'], queryFn: getCurrentRisk, refetchInterval: 15_000 });
    const { data: rainfall = [] } = useQuery({ queryKey: ['rainfall', 30], queryFn: () => getRainfallSeries(30) });
    const { data: water = [] } = useQuery({ queryKey: ['water-level'], queryFn: () => getWaterLevel(30) });
    const { data: subs } = useQuery({ queryKey: ['subscriber-count'], queryFn: getSubscriberCount, refetchInterval: 30_000 });
    const { data: alerts = [] } = useQuery({ queryKey: ['alert-history'], queryFn: getAlertHistory, refetchInterval: 30_000 });
    const { data: health, isLoading: healthLoading } = useQuery({
        queryKey: ['system-health'],
        queryFn: getSystemHealth,
        refetchInterval: 60_000,
    });

    // Manual alert mutation
    const alertMutation = useMutation({
        mutationFn: dispatchManualAlert,
        onSuccess: (data) => {
            toast.success(t('admin.toast.success', { val: data.recipients }));
            setMessageFr('');
            setMessageEn('');
            setShowConfirm(false);
            queryClient.invalidateQueries({ queryKey: ['alert-history'] });
            queryClient.invalidateQueries({ queryKey: ['risk-current'] });
        },
        onError: () => {
            toast.error(t('admin.toast.error'));
            setShowConfirm(false);
        },
    });

    function handleDispatch() {
        if (!messageFr.trim()) {
            toast.error(t('admin.dispatch.msg_fr_required'));
            return;
        }
        alertMutation.mutate({
            risk_level: alertLevel,
            message_fr: messageFr,
            message_en: messageEn,
        });
    }

    const riskBadgeLabel = (lvl: RiskLevel) => locale === 'fr' ? RISK_CONFIG[lvl].labelFr : RISK_CONFIG[lvl].label;

    const currentRisk = risk || { risk_level: 'low' as RiskLevel, probability: 0 };
    const cfg = RISK_CONFIG[currentRisk.risk_level as RiskLevel] || RISK_CONFIG.low;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-blue-600" />
                            {t('admin.title')}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {t('admin.desc')}
                        </p>
                    </div>
                    <button
                        onClick={() => queryClient.invalidateQueries()}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                       text-gray-600 bg-white border border-gray-200 rounded-xl
                       hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {t('admin.refresh')}
                    </button>
                    <Link href="/admin/subscribers"
                        className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border
             border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                        View subscribers
                    </Link>
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <AdminKPI
                        icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
                        bg="bg-orange-50"
                        label={t('admin.kpi.risk')}
                        value={locale === 'fr' ? cfg.labelFr : cfg.label}
                        subtext={t('admin.kpi.probability', { val: (currentRisk.probability * 100).toFixed(0) })}
                        highlight={currentRisk.risk_level === 'critical' || currentRisk.risk_level === 'high'}
                    />
                    <AdminKPI
                        icon={<Users className="w-5 h-5 text-purple-500" />}
                        bg="bg-purple-50"
                        label={t('admin.kpi.subscribers')}
                        value={formatNumber(subs?.count ?? 0)}
                        subtext={t('admin.kpi.subscribers_sub')}
                    />
                    <AdminKPI
                        icon={<Bell className="w-5 h-5 text-blue-500" />}
                        bg="bg-blue-50"
                        label={t('admin.kpi.alerts')}
                        value={String(alerts.length)}
                        subtext={t('admin.kpi.alerts_sub')}
                    />
                    <AdminKPI
                        icon={<CloudRain className="w-5 h-5 text-teal-500" />}
                        bg="bg-teal-50"
                        label={t('admin.kpi.rain')}
                        value={rainfall[0] ? `${rainfall[0].cumulative_7d.toFixed(0)} mm` : '—'}
                        subtext="Cumul 7 jours"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN — Manual Alert + System Health */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Manual Alert Dispatch */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1
                             flex items-center gap-2">
                                <Send className="w-4 h-4 text-blue-600" />
                                {t('admin.dispatch.title')}
                            </h2>
                            <p className="text-xs text-gray-400 mb-5">
                                {t('admin.dispatch.desc')}
                            </p>

                            {/* Risk Level Selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('admin.dispatch.risk')}
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map((lvl) => {
                                        const c = RISK_CONFIG[lvl];
                                        return (
                                            <button
                                                key={lvl}
                                                onClick={() => setAlertLevel(lvl)}
                                                className={cn(
                                                    'py-2.5 rounded-xl border-2 text-sm font-semibold',
                                                    'transition-all duration-150',
                                                    alertLevel === lvl
                                                        ? `${c.bgColor} ${c.textColor} ${c.border}`
                                                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                )}
                                            >
                                                {c.icon} {riskBadgeLabel(lvl)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* French Message */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t('admin.dispatch.msg_fr')}
                                </label>
                                <textarea
                                    value={messageFr}
                                    onChange={(e) => setMessageFr(e.target.value)}
                                    placeholder="Risque élevé d'inondation détecté. Veuillez évacuer les zones basses immédiatement et rejoindre les zones d'abri désignées."
                                    rows={3}
                                    maxLength={500}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                             bg-gray-50 focus:bg-white focus:outline-none
                             focus:ring-2 focus:ring-blue-500 resize-none
                             transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    {messageFr.length}/500
                                </p>
                            </div>

                            {/* English Message */}
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t('admin.dispatch.msg_en')}
                                </label>
                                <textarea
                                    value={messageEn}
                                    onChange={(e) => setMessageEn(e.target.value)}
                                    placeholder="High flood risk detected. Please evacuate low-lying areas immediately."
                                    rows={2}
                                    maxLength={500}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                             bg-gray-50 focus:bg-white focus:outline-none
                             focus:ring-2 focus:ring-blue-500 resize-none
                             transition-all"
                                />
                            </div>

                            {/* Preview */}
                            {messageFr && (
                                <div className={cn(
                                    'mb-5 p-4 rounded-xl border-l-4 text-sm',
                                    RISK_CONFIG[alertLevel].bgColor,
                                    RISK_CONFIG[alertLevel].border,
                                )}>
                                    <p className="font-semibold text-gray-700 mb-1 text-xs uppercase
                                tracking-wide">
                                        {t('admin.dispatch.preview', { val: subs?.count ?? 0 })}
                                    </p>
                                    <p className={cn('font-medium', RISK_CONFIG[alertLevel].textColor)}>
                                        {t('admin.dispatch.sms_alert')}{riskBadgeLabel(alertLevel).toUpperCase()}
                                    </p>
                                    <p className="text-gray-600 mt-1">{messageFr}</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        {t('admin.dispatch.sms_footer')}
                                    </p>
                                </div>
                            )}

                            {/* Confirm / Send */}
                            {!showConfirm ? (
                                <button
                                    onClick={() => {
                                        if (!messageFr.trim()) {
                                            toast.error(t('admin.dispatch.msg_fr_required'));
                                            return;
                                        }
                                        setShowConfirm(true);
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700
                             text-white rounded-xl font-semibold text-sm
                             hover:from-blue-700 hover:to-blue-800
                             transition-all shadow-lg shadow-blue-500/20
                             flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    {t('admin.dispatch.btn_send', { val: subs?.count ?? 0 })}
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-sm font-semibold text-red-800 mb-1">
                                            {t('admin.dispatch.confirm_title')}
                                        </p>
                                        <p className="text-sm text-red-700">
                                            {t('admin.dispatch.confirm_desc', { val: subs?.count ?? 0 })}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDispatch}
                                            disabled={alertMutation.isPending}
                                            className="flex-1 py-3 bg-red-600 text-white rounded-xl
                                 font-semibold text-sm hover:bg-red-700
                                 disabled:opacity-50 transition-colors
                                 flex items-center justify-center gap-2"
                                        >
                                            {alertMutation.isPending ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30
                                          border-t-white rounded-full animate-spin" />
                                                    {t('admin.dispatch.sending')}
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    {t('admin.dispatch.confirm_btn')}
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl
                                 font-semibold text-sm hover:bg-gray-200 transition-colors"
                                        >
                                            {t('admin.dispatch.cancel')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* System Health */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-4
                             flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-600" />
                                {t('admin.health.title')}
                            </h2>

                            {healthLoading ? (
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : health ? (
                                <div className="space-y-3">
                                    <HealthRow
                                        icon={<Cpu className="w-4 h-4 text-blue-500" />}
                                        label={t('admin.health.model')}
                                        value={health.current_risk?.model || t('hist.not_specified')}
                                        status="ok"
                                    />
                                    <HealthRow
                                        icon={<Database className="w-4 h-4 text-teal-500" />}
                                        label={t('admin.health.satellite')}
                                        value={health.last_satellite_fetch?.date
                                            ? timeAgo(health.last_satellite_fetch.date, locale)
                                            : t('admin.health.satellite_never')}
                                        status={health.last_satellite_fetch?.status === 'success'
                                            ? 'ok' : 'warn'}
                                    />
                                    <HealthRow
                                        icon={<CloudRain className="w-4 h-4 text-blue-500" />}
                                        label={t('admin.health.rain')}
                                        value={health.latest_rainfall_date
                                            ? formatDate(health.latest_rainfall_date)
                                            : t('admin.health.rain_none')}
                                        status="ok"
                                    />
                                    <HealthRow
                                        icon={<Droplets className="w-4 h-4 text-teal-500" />}
                                        label={t('admin.health.lake')}
                                        value={health.latest_water_date
                                            ? formatDate(health.latest_water_date)
                                            : t('admin.health.lake_none')}
                                        status="ok"
                                    />
                                    <HealthRow
                                        icon={<BarChart3 className="w-4 h-4 text-purple-500" />}
                                        label={t('admin.health.events')}
                                        value={String(health.total_flood_events || 0)}
                                        status="ok"
                                    />
                                    <HealthRow
                                        icon={<Users className="w-4 h-4 text-purple-500" />}
                                        label={t('admin.health.subscribers')}
                                        value={formatNumber(health.active_subscribers || 0)}
                                        status="ok"
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    {t('admin.health.error')}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT COLUMN — Recent Alerts + Current Risk */}
                    <div className="space-y-6">

                        {/* Current Risk Card */}
                        <div className={cn(
                            'rounded-2xl border-2 shadow-sm p-6 text-center',
                            cfg.bgColor, cfg.border
                        )}>
                            <p className="text-xs font-semibold uppercase tracking-widest
                            text-gray-500 mb-3">
                                {t('admin.kpi.risk')}
                            </p>
                            <div className="text-5xl mb-2">{cfg.icon}</div>
                            <p className={cn('text-2xl font-black', cfg.textColor)}>
                                {riskBadgeLabel(currentRisk.risk_level)}
                            </p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {(currentRisk.probability * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {risk?.assessed_at
                                    ? `${t('db.updated')} ${timeAgo(risk.assessed_at, locale)}`
                                    : 'En attente...'}
                            </p>
                            {risk?.is_manual_override && (
                                <span className="inline-block mt-2 text-xs bg-yellow-100
                                 text-yellow-700 px-2 py-0.5 rounded-full">
                                    ⚡ {locale === 'fr' ? 'Déclenchement manuel' : 'Manual Trigger'}
                                </span>
                            )}
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-sm font-semibold text-gray-900 mb-3
                             flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {t('admin.recent.title')}
                            </h2>

                            {alerts.length === 0 ? (
                                <div className="text-center py-6">
                                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">{t('admin.recent.none')}</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                                    {alerts.map((alert) => {
                                        const ac = RISK_CONFIG[alert.risk_level as RiskLevel];
                                        return (
                                            <div
                                                key={alert.id}
                                                className={cn(
                                                    'p-3 rounded-xl border-l-4 text-xs',
                                                    ac.bgColor, ac.border
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={cn('font-semibold', ac.textColor)}>
                                                        {ac.icon} {ac.labelFr}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">
                                                        {timeAgo(alert.triggered_at, locale)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 line-clamp-2 leading-relaxed">
                                                    {locale === 'fr' ? alert.message_fr : (alert.message_en || alert.message_fr)}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5
                                        text-gray-400">
                                                    <span>📨 {alert.total_recipients}</span>
                                                    <span>📱 {alert.sms_sent}</span>
                                                    <span>📧 {alert.email_sent}</span>
                                                    <span className="ml-auto">
                                                        {alert.alert_type === 'manual'
                                                            ? '👤 Manuel'
                                                            : '🤖 Auto'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h2 className="text-sm font-semibold text-gray-900 mb-3">
                                {t('admin.recent.stats')}
                            </h2>
                            <div className="space-y-2">
                                <QuickStat
                                    label={t('admin.recent.rain_30d')}
                                    value={rainfall[0]
                                        ? `${rainfall[0].cumulative_30d.toFixed(0)} mm`
                                        : '—'}
                                    icon="🌧️"
                                />
                                <QuickStat
                                    label={t('admin.recent.lake_maga')}
                                    value={water[0]
                                        ? `${water[0].water_area_km2.toFixed(0)} km²`
                                        : '—'}
                                    icon="💧"
                                />
                                <QuickStat
                                    label={t('admin.recent.filling')}
                                    value={water[0]
                                        ? `${water[0].fill_percentage.toFixed(0)}%`
                                        : '—'}
                                    icon="📊"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AdminKPI({ icon, bg, label, value, subtext, highlight }: {
    icon: React.ReactNode; bg: string;
    label: string; value: string; subtext: string;
    highlight?: boolean;
}) {
    return (
        <div className={cn(
            'bg-white rounded-xl border shadow-sm p-5 transition-all',
            highlight
                ? 'border-orange-300 shadow-orange-100'
                : 'border-gray-100 hover:shadow-md'
        )}>
            <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>{icon}</div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {label}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
    );
}

function HealthRow({ icon, label, value, status }: {
    icon: React.ReactNode; label: string;
    value: string; status: 'ok' | 'warn' | 'error';
}) {
    return (
        <div className="flex items-center justify-between py-2.5 px-3
                    bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2.5">
                {icon}
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{value}</span>
                <div className={cn(
                    'w-2 h-2 rounded-full',
                    status === 'ok' && 'bg-green-400',
                    status === 'warn' && 'bg-yellow-400',
                    status === 'error' && 'bg-red-400',
                )} />
            </div>
        </div>
    );
}

function QuickStat({ label, value, icon }: {
    label: string; value: string; icon: string;
}) {
    return (
        <div className="flex items-center justify-between py-2 px-3
                    bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-500 flex items-center gap-2">
                <span>{icon}</span>{label}
            </span>
            <span className="text-sm font-bold text-gray-900">{value}</span>
        </div>
    );
}