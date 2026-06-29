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
import toast from 'react-hot-toast';
import {
    Shield, AlertTriangle, Users, Activity,
    Send, CheckCircle, Clock, Database,
    CloudRain, Droplets, Bell,
    BarChart3, Cpu,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const dispatchManualAlert = (data: {
    risk_level: string;
    message_fr: string;
    message_en: string;
}) => apiClient.post('/admin/alerts/dispatch/', data).then(r => r.data);

// Risk → one functional color
const RISK_COLOR: Record<string, string> = {
    critical: '#991b1b', high: '#c2410c', medium: '#b45309', low: 'var(--fw-teal)',
};

export default function AdminPage() {
    const { t, locale } = useLanguage();
    const queryClient = useQueryClient();

    const [alertLevel, setAlertLevel] = useState<RiskLevel>('high');
    const [messageFr, setMessageFr] = useState('');
    const [messageEn, setMessageEn] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const { data: risk } = useQuery({ queryKey: ['risk-current'], queryFn: getCurrentRisk, refetchInterval: 15_000 });
    const { data: rainfall = [] } = useQuery({ queryKey: ['rainfall', 30], queryFn: () => getRainfallSeries(30) });
    const { data: water = [] } = useQuery({ queryKey: ['water-level'], queryFn: () => getWaterLevel(30) });
    const { data: subs } = useQuery({ queryKey: ['subscriber-count'], queryFn: getSubscriberCount, refetchInterval: 30_000 });
    const { data: alerts = [] } = useQuery({ queryKey: ['alert-history'], queryFn: getAlertHistory, refetchInterval: 30_000 });
    const { data: health, isLoading: healthLoading } = useQuery({
        queryKey: ['system-health'], queryFn: getSystemHealth, refetchInterval: 60_000,
    });

    const alertMutation = useMutation({
        mutationFn: dispatchManualAlert,
        onSuccess: (data) => {
            toast.success(t('admin.toast.success', { val: data.recipients }));
            setMessageFr(''); setMessageEn(''); setShowConfirm(false);
            queryClient.invalidateQueries({ queryKey: ['alert-history'] });
            queryClient.invalidateQueries({ queryKey: ['risk-current'] });
        },
        onError: () => { toast.error(t('admin.toast.error')); setShowConfirm(false); },
    });

    function handleDispatch() {
        if (!messageFr.trim()) { toast.error(t('admin.dispatch.msg_fr_required')); return; }
        alertMutation.mutate({ risk_level: alertLevel, message_fr: messageFr, message_en: messageEn });
    }

    const riskBadgeLabel = (lvl: RiskLevel) => locale === 'fr' ? RISK_CONFIG[lvl].labelFr : RISK_CONFIG[lvl].label;
    const currentRisk = risk || { risk_level: 'low' as RiskLevel, probability: 0 };
    const rc = RISK_COLOR[currentRisk.risk_level] ?? 'var(--fw-teal)';

    return (
        <div className="min-h-screen font-sans" style={{ background: 'var(--fw-paper)' }}>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}
                <div className="flex items-end justify-between mb-8 flex-wrap gap-4 fw-rise">
                    <div>
                        <p className="text-[12px] tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--fw-teal)' }}>
                            Authority console
                        </p>
                        <h1 className="text-3xl sm:text-[2.2rem] font-semibold tracking-tight leading-none"
                            style={{ color: 'var(--fw-deep)' }}>
                            {t('admin.title')}
                        </h1>
                        <p className="mt-3 text-[13px]" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                            {t('admin.desc')}
                        </p>
                    </div>
                    <Link href="/admin/subscribers"
                        className="px-4 py-2 text-[13px] font-medium rounded-full border transition-colors hover:bg-[var(--fw-mist)]"
                        style={{ borderColor: 'var(--fw-line)', color: 'var(--fw-deep)' }}>
                        View subscribers
                    </Link>
                </div>

                {/* KPI strip — hairline divided */}
                <div className="grid grid-cols-2 lg:grid-cols-4 border-y mb-8 fw-rise"
                    style={{ borderColor: 'var(--fw-line)' }}>
                    {[
                        { label: t('admin.kpi.risk'), value: riskBadgeLabel(currentRisk.risk_level), sub: t('admin.kpi.probability', { val: (currentRisk.probability * 100).toFixed(0) }), accent: rc },
                        { label: t('admin.kpi.subscribers'), value: formatNumber(subs?.count ?? 0), sub: t('admin.kpi.subscribers_sub') },
                        { label: t('admin.kpi.alerts'), value: String(alerts.length), sub: t('admin.kpi.alerts_sub') },
                        { label: t('admin.kpi.rain'), value: rainfall[0] ? `${rainfall[0].cumulative_7d.toFixed(0)} mm` : '—', sub: '7-day total' },
                    ].map((k, i) => (
                        <div key={i} className={cn('px-5 py-6', i < 3 && 'border-r', i < 2 && 'border-b lg:border-b-0')}
                            style={{ borderColor: 'var(--fw-line)' }}>
                            <div className="text-[10.5px] uppercase tracking-[0.14em] mb-2.5"
                                style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>{k.label}</div>
                            <div className="text-[1.5rem] font-semibold leading-none"
                                style={{ color: k.accent || 'var(--fw-deep)' }}>{k.value}</div>
                            <div className="text-[12px] mt-2" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>{k.sub}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT — Dispatch + Health */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Manual Alert Dispatch */}
                        <div className="rounded-2xl border p-6 fw-rise"
                            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                            <h2 className="text-[15px] font-semibold mb-1 flex items-center gap-2"
                                style={{ color: 'var(--fw-deep)' }}>
                                <Send className="w-4 h-4" style={{ color: 'var(--fw-teal)' }} />
                                {t('admin.dispatch.title')}
                            </h2>
                            <p className="text-[12.5px] mb-5" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                                {t('admin.dispatch.desc')}
                            </p>

                            {/* Risk level selector */}
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium mb-2" style={{ color: 'var(--fw-ink)' }}>
                                    {t('admin.dispatch.risk')}
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map((lvl) => {
                                        const active = alertLevel === lvl;
                                        const color = RISK_COLOR[lvl];
                                        return (
                                            <button key={lvl} onClick={() => setAlertLevel(lvl)}
                                                className="py-2.5 rounded-xl border-2 text-[13px] font-medium transition-all"
                                                style={active
                                                    ? { borderColor: color, color, background: 'var(--fw-mist)' }
                                                    : { borderColor: 'var(--fw-line)', color: 'var(--fw-ink)', opacity: 0.55 }}>
                                                {riskBadgeLabel(lvl)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* French message */}
                            <div className="mb-4">
                                <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--fw-ink)' }}>
                                    {t('admin.dispatch.msg_fr')}
                                </label>
                                <textarea value={messageFr} onChange={(e) => setMessageFr(e.target.value)}
                                    placeholder="Risque élevé d'inondation détecté. Veuillez évacuer les zones basses immédiatement."
                                    rows={3} maxLength={500}
                                    className="w-full px-4 py-3 rounded-xl text-[14px] resize-none outline-none transition-all"
                                    style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)', color: 'var(--fw-ink)' }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--fw-teal)'; e.currentTarget.style.background = '#fff'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--fw-line)'; e.currentTarget.style.background = 'var(--fw-mist)'; }} />
                                <p className="text-[11px] mt-1 text-right" style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                                    {messageFr.length}/500
                                </p>
                            </div>

                            {/* English message */}
                            <div className="mb-5">
                                <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--fw-ink)' }}>
                                    {t('admin.dispatch.msg_en')}
                                </label>
                                <textarea value={messageEn} onChange={(e) => setMessageEn(e.target.value)}
                                    placeholder="High flood risk detected. Please evacuate low-lying areas immediately."
                                    rows={2} maxLength={500}
                                    className="w-full px-4 py-3 rounded-xl text-[14px] resize-none outline-none transition-all"
                                    style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)', color: 'var(--fw-ink)' }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--fw-teal)'; e.currentTarget.style.background = '#fff'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--fw-line)'; e.currentTarget.style.background = 'var(--fw-mist)'; }} />
                            </div>

                            {/* Preview */}
                            {messageFr && (
                                <div className="mb-5 p-4 rounded-xl border-l-4 text-[14px]"
                                    style={{ background: 'var(--fw-mist)', borderColor: rc }}>
                                    <p className="font-semibold mb-1 text-[11px] uppercase tracking-wide"
                                        style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                                        {t('admin.dispatch.preview', { val: subs?.count ?? 0 })}
                                    </p>
                                    <p className="font-medium" style={{ color: rc }}>
                                        {t('admin.dispatch.sms_alert')}{riskBadgeLabel(alertLevel).toUpperCase()}
                                    </p>
                                    <p className="mt-1" style={{ color: 'var(--fw-ink)', opacity: 0.7 }}>{messageFr}</p>
                                </div>
                            )}

                            {/* Confirm / Send */}
                            {!showConfirm ? (
                                <button onClick={() => {
                                    if (!messageFr.trim()) { toast.error(t('admin.dispatch.msg_fr_required')); return; }
                                    setShowConfirm(true);
                                }}
                                    className="w-full py-3 rounded-xl text-white font-medium text-[15px] shadow-lg transition-all hover:-translate-y-px flex items-center justify-center gap-2"
                                    style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
                                    <Send className="w-4 h-4" />
                                    {t('admin.dispatch.btn_send', { val: subs?.count ?? 0 })}
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                        <p className="text-[14px] font-semibold mb-1" style={{ color: '#991b1b' }}>
                                            {t('admin.dispatch.confirm_title')}
                                        </p>
                                        <p className="text-[13.5px]" style={{ color: '#b91c1c' }}>
                                            {t('admin.dispatch.confirm_desc', { val: subs?.count ?? 0 })}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleDispatch} disabled={alertMutation.isPending}
                                            className="flex-1 py-3 rounded-xl text-white font-medium text-[14px] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                            style={{ background: '#c2410c' }}>
                                            {alertMutation.isPending ? (
                                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {t('admin.dispatch.sending')}</>
                                            ) : (
                                                <><CheckCircle className="w-4 h-4" />{t('admin.dispatch.confirm_btn')}</>
                                            )}
                                        </button>
                                        <button onClick={() => setShowConfirm(false)}
                                            className="flex-1 py-3 rounded-xl font-medium text-[14px] transition-colors"
                                            style={{ background: 'var(--fw-mist)', color: 'var(--fw-deep)' }}>
                                            {t('admin.dispatch.cancel')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* System Health */}
                        <div className="rounded-2xl border p-6 fw-rise"
                            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                            <h2 className="text-[15px] font-semibold mb-4 flex items-center gap-2"
                                style={{ color: 'var(--fw-deep)' }}>
                                <Activity className="w-4 h-4" style={{ color: 'var(--fw-teal)' }} />
                                {t('admin.health.title')}
                            </h2>

                            {healthLoading ? (
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--fw-mist)' }} />
                                    ))}
                                </div>
                            ) : health ? (
                                <div className="space-y-2.5">
                                    <HealthRow icon={<Cpu className="w-4 h-4" />} label={t('admin.health.model')}
                                        value={health.current_risk?.model || t('hist.not_specified')} status="ok" />
                                    <HealthRow icon={<Database className="w-4 h-4" />} label={t('admin.health.satellite')}
                                        value={health.last_satellite_fetch?.date ? timeAgo(health.last_satellite_fetch.date, locale) : t('admin.health.satellite_never')}
                                        status={health.last_satellite_fetch?.status === 'success' ? 'ok' : 'warn'} />
                                    <HealthRow icon={<CloudRain className="w-4 h-4" />} label={t('admin.health.rain')}
                                        value={health.latest_rainfall_date ? formatDate(health.latest_rainfall_date) : t('admin.health.rain_none')} status="ok" />
                                    <HealthRow icon={<Droplets className="w-4 h-4" />} label={t('admin.health.lake')}
                                        value={health.latest_water_date ? formatDate(health.latest_water_date) : t('admin.health.lake_none')} status="ok" />
                                    <HealthRow icon={<BarChart3 className="w-4 h-4" />} label={t('admin.health.events')}
                                        value={String(health.total_flood_events || 0)} status="ok" />
                                    <HealthRow icon={<Users className="w-4 h-4" />} label={t('admin.health.subscribers')}
                                        value={formatNumber(health.active_subscribers || 0)} status="ok" />
                                </div>
                            ) : (
                                <div className="text-center py-6 text-[14px]" style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                                    {t('admin.health.error')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Current risk + Recent alerts + Stats */}
                    <div className="space-y-6">

                        {/* Current risk dial */}
                        <div className="rounded-2xl border p-6 text-center fw-rise"
                            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                            <p className="text-[10.5px] uppercase tracking-[0.16em] mb-4"
                                style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>{t('admin.kpi.risk')}</p>
                            <div className="relative w-28 h-28 mx-auto">
                                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 112 112">
                                    <circle cx="56" cy="56" r="48" fill="none" stroke="var(--fw-line)" strokeWidth="8" />
                                    <circle cx="56" cy="56" r="48" fill="none" stroke={rc} strokeWidth="8"
                                        strokeLinecap="round" strokeDasharray={2 * Math.PI * 48}
                                        strokeDashoffset={2 * Math.PI * 48 * (1 - currentRisk.probability)}
                                        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-semibold tabular-nums" style={{ color: 'var(--fw-deep)' }}>
                                        {(currentRisk.probability * 100).toFixed(0)}%
                                    </span>
                                    <span className="text-[12px] font-medium mt-0.5" style={{ color: rc }}>
                                        {riskBadgeLabel(currentRisk.risk_level)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[12px] mt-4" style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                {risk?.assessed_at ? `${t('db.updated')} ${timeAgo(risk.assessed_at, locale)}` : 'Pending…'}
                            </p>
                        </div>

                        {/* Recent alerts */}
                        <div className="rounded-2xl border p-5 fw-rise"
                            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                            <h2 className="text-[14px] font-semibold mb-3 flex items-center gap-2"
                                style={{ color: 'var(--fw-deep)' }}>
                                <Clock className="w-4 h-4" style={{ color: 'var(--fw-ink)', opacity: 0.4 }} />
                                {t('admin.recent.title')}
                            </h2>

                            {alerts.length === 0 ? (
                                <div className="text-center py-6">
                                    <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--fw-line)' }} />
                                    <p className="text-[12px]" style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>{t('admin.recent.none')}</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                                    {alerts.map((alert) => {
                                        const color = RISK_COLOR[alert.risk_level] ?? 'var(--fw-teal)';
                                        return (
                                            <div key={alert.id} className="p-3 rounded-xl border-l-4 text-[12px]"
                                                style={{ background: 'var(--fw-mist)', borderColor: color }}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold" style={{ color }}>
                                                        {riskBadgeLabel(alert.risk_level as RiskLevel)}
                                                    </span>
                                                    <span style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                                                        {timeAgo(alert.triggered_at, locale)}
                                                    </span>
                                                </div>
                                                <p className="line-clamp-2 leading-relaxed" style={{ color: 'var(--fw-ink)', opacity: 0.7 }}>
                                                    {locale === 'fr' ? alert.message_fr : (alert.message_en || alert.message_fr)}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5" style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                                    <span>{alert.total_recipients} recipients</span>
                                                    <span>{alert.email_sent} email</span>
                                                    <span className="ml-auto">
                                                        {alert.alert_type === 'manual' ? 'Manual' : 'Auto'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick stats */}
                        <div className="rounded-2xl border p-5 fw-rise"
                            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                            <h2 className="text-[14px] font-semibold mb-3" style={{ color: 'var(--fw-deep)' }}>
                                {t('admin.recent.stats')}
                            </h2>
                            <div className="space-y-2">
                                <QuickStat label={t('admin.recent.rain_30d')}
                                    value={rainfall[0] ? `${rainfall[0].cumulative_30d.toFixed(0)} mm` : '—'} />
                                <QuickStat label={t('admin.recent.lake_maga')}
                                    value={water[0] ? `${water[0].water_area_km2.toFixed(0)} km²` : '—'} />
                                <QuickStat label={t('admin.recent.filling')}
                                    value={water[0] ? `${water[0].fill_percentage.toFixed(0)}%` : '—'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HealthRow({ icon, label, value, status }: {
    icon: React.ReactNode; label: string; value: string; status: 'ok' | 'warn' | 'error';
}) {
    const dot = status === 'ok' ? 'var(--fw-teal)' : status === 'warn' ? '#b45309' : '#c2410c';
    return (
        <div className="flex items-center justify-between py-2.5 px-3 rounded-xl" style={{ background: 'var(--fw-mist)' }}>
            <div className="flex items-center gap-2.5">
                <span style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>{icon}</span>
                <span className="text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.7 }}>{label}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-medium" style={{ color: 'var(--fw-deep)' }}>{value}</span>
                <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
            </div>
        </div>
    );
}

function QuickStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: 'var(--fw-mist)' }}>
            <span className="text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>{label}</span>
            <span className="text-[13.5px] font-semibold" style={{ color: 'var(--fw-deep)' }}>{value}</span>
        </div>
    );
}