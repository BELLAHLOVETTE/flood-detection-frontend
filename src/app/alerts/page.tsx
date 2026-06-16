// src/app/alerts/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Navbar from '@/components/Navbar';
import { subscribeToAlerts, verifyOTP, getAlertHistory } from '@/lib/api';
import { RISK_CONFIG } from '@/types';
import { timeAgo } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';
import {
    Bell, CheckCircle2, Phone, Mail, AlertTriangle, Clock,
    ShieldCheck, Loader2, ArrowLeft, Sparkles, MessageSquare, Inbox,
} from 'lucide-react';

type Step = 'form' | 'verify' | 'success';
type Channel = 'sms' | 'email' | 'both';
type Lang = 'fr' | 'en';

const SEVERITY_STYLES: Record<string, { bar: string; dot: string; ring: string; bg: string; text: string }> = {
    critical: { bar: 'bg-red-500', dot: 'bg-red-500', ring: 'ring-red-200', bg: 'bg-red-50', text: 'text-red-700' },
    high: { bar: 'bg-orange-500', dot: 'bg-orange-500', ring: 'ring-orange-200', bg: 'bg-orange-50', text: 'text-orange-700' },
    medium: { bar: 'bg-amber-400', dot: 'bg-amber-400', ring: 'ring-amber-200', bg: 'bg-amber-50', text: 'text-amber-700' },
    low: { bar: 'bg-emerald-500', dot: 'bg-emerald-500', ring: 'ring-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const CHANNEL_OPTIONS: { value: Channel; label: string; icon: React.ReactNode }[] = [
    { value: 'sms', label: 'SMS', icon: <Phone className="h-5 w-5" /> },
    { value: 'email', label: 'Email', icon: <Mail className="h-5 w-5" /> },
    { value: 'both', label: 'SMS + Email', icon: <Bell className="h-5 w-5" /> },
];

export default function AlertsPage() {
    const { t, locale } = useLanguage();

    const [step, setStep] = useState<Step>('form');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [channel, setChannel] = useState<Channel>('sms');
    const [language, setLanguage] = useState<Lang>('fr');
    const [subId, setSubId] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { data: alerts = [] } = useSWR('alert-history', () => getAlertHistory(), {
        refreshInterval: 60000,
    });

    async function handleSubscribe() {
        setError('');
        if (channel === 'sms' && !phone) return setError(t('alerts.error.phone'));
        if (channel === 'email' && !email) return setError(t('alerts.error.email'));
        if (channel === 'both' && !phone && !email) return setError(t('alerts.error.phone_or_email'));

        setLoading(true);
        try {
            const result = await subscribeToAlerts({
                phone: phone || undefined,
                email: email || undefined,
                channel,
                language,
            });
            setSubId(result.sub_id);
            setStep('verify');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { non_field_errors?: string[] } } };
            setError(
                axiosErr?.response?.data?.non_field_errors?.[0] ||
                'An error occurred. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify() {
        setError('');
        if (otp.length !== 6) return setError(t('alerts.error.otp_digits'));

        setLoading(true);
        try {
            const result = await verifyOTP(subId, otp);
            if (result.verified) setStep('success');
            else setError(result.error || t('alerts.error.otp_invalid'));
        } catch {
            setError(t('alerts.error.verify_failed'));
        } finally {
            setLoading(false);
        }
    }

    const channelDisplayStr = phone
        ? t('alerts.verify.phone', { val: phone.slice(-4) })
        : t('alerts.verify.email');

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <Navbar />

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white">
                <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_45%)]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30 grid place-items-center shadow-lg">
                            <Bell className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                {t('alerts.title')}
                            </h1>
                            <p className="mt-1 text-white/85 max-w-2xl text-sm sm:text-base">
                                {t('alerts.desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT — Subscription Card */}
                    <div className="lg:col-span-2">
                        <div className="rounded-3xl bg-white/90 backdrop-blur shadow-xl ring-1 ring-slate-200 p-6 sm:p-8">
                            {/* Step indicator */}
                            <StepIndicator current={step} />

                            {step === 'form' && (
                                <div className="mt-6 space-y-5">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{t('alerts.form.title')}</h2>
                                        <p className="text-sm text-slate-500 mt-1">{t('alerts.form.desc')}</p>
                                    </div>

                                    {/* Channel */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                            {t('alerts.channel.label')}
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {CHANNEL_OPTIONS.map((opt) => {
                                                const active = channel === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setChannel(opt.value)}
                                                        className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-sm font-medium transition-all ${active
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-4 ring-blue-100'
                                                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <span className={active ? 'text-blue-600' : 'text-slate-500'}>{opt.icon}</span>
                                                        {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    {(channel === 'sms' || channel === 'both') && (
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                                {t('alerts.phone.label')}
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+237 6XX XXX XXX"
                                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <p className="mt-1.5 text-xs text-slate-400">{t('alerts.phone.format')}</p>
                                        </div>
                                    )}

                                    {/* Email */}
                                    {(channel === 'email' || channel === 'both') && (
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                                {t('alerts.email.label')}
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="votre@email.com"
                                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Language */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                            {t('alerts.lang.label')}
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                                            {[
                                                { value: 'fr' as const, label: 'Français' },
                                                { value: 'en' as const, label: 'English' },
                                            ].map((opt) => {
                                                const active = language === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setLanguage(opt.value)}
                                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {error && <ErrorBanner message={error} />}

                                    <button
                                        type="button"
                                        onClick={handleSubscribe}
                                        disabled={loading}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                {t('alerts.btn.send_code')}
                                            </>
                                        ) : (
                                            <>
                                                <Bell className="h-4 w-4" />
                                                {t('alerts.btn.subscribe')}
                                            </>
                                        )}
                                    </button>

                                    <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        {'Your data is encrypted and never shared.'}
                                    </p>
                                </div>
                            )}

                            {step === 'verify' && (
                                <div className="mt-6 space-y-5">
                                    <div className="text-center">
                                        <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-50 ring-1 ring-blue-100 grid place-items-center">
                                            <MessageSquare className="h-7 w-7 text-blue-600" />
                                        </div>
                                        <h2 className="mt-3 text-xl font-bold text-slate-900">{t('alerts.verify.title')}</h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {t('alerts.verify.sent', { channel: channelDisplayStr })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 text-center">
                                            {t('alerts.verify.label')}
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="123456"
                                            maxLength={6}
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                                        />
                                    </div>

                                    {error && <ErrorBanner message={error} />}

                                    <button
                                        type="button"
                                        onClick={handleVerify}
                                        disabled={loading}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-60"
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                        {loading ? t('alerts.verify.verifying') : t('alerts.verify.confirm')}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setStep('form'); setError(''); setOtp(''); }}
                                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-sm text-slate-500 hover:text-slate-700"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        {t('alerts.verify.back')}
                                    </button>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="mt-6 text-center space-y-5">
                                    <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 ring-4 ring-emerald-100 grid place-items-center">
                                        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{t('alerts.success.title')}</h2>
                                        <p className="mt-1 text-sm text-slate-500">{t('alerts.success.desc')}</p>
                                    </div>

                                    <div className="text-left rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
                                        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            {t('alerts.success.rules.title')}
                                        </p>
                                        <ul className="space-y-2 text-sm text-slate-700">
                                            <li className="flex gap-2"><span>🟠</span><span>{t('alerts.success.rules.1')}</span></li>
                                            <li className="flex gap-2"><span>🔴</span><span>{t('alerts.success.rules.2')}</span></li>
                                            <li className="flex gap-2"><span>🟢</span><span>{t('alerts.success.rules.3')}</span></li>
                                        </ul>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('form'); setPhone(''); setEmail(''); setOtp(''); setError('');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        {t('alerts.success.another')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Alert History */}
                    <div className="lg:col-span-3">
                        <div className="rounded-3xl bg-white/90 backdrop-blur shadow-xl ring-1 ring-slate-200 p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{t('alerts.history.title')}</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">Recent alerts sent to subscribers</p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-100">
                                    <Inbox className="h-3.5 w-3.5" />
                                    {alerts.length}
                                </span>
                            </div>

                            {alerts.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 grid place-items-center">
                                        <Bell className="h-7 w-7 text-slate-400" />
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-slate-700">{t('alerts.history.empty')}</p>
                                    <p className="mt-1 text-sm text-slate-400">{t('alerts.history.empty_desc')}</p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {alerts.map((alert) => {
                                        const config = RISK_CONFIG[alert.risk_level];
                                        const styles = SEVERITY_STYLES[alert.risk_level] || SEVERITY_STYLES.medium;
                                        const riskLabel = locale === 'fr' ? config.labelFr : config.label;
                                        return (
                                            <li
                                                key={alert.id}
                                                className={`relative rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-md transition-all p-4 sm:p-5 border-l-4 ${styles.bar.replace('bg-', 'border-')}`}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${styles.bg} ${styles.text} ring-1 ${styles.ring}`}>
                                                                {config.icon} {riskLabel}
                                                            </span>
                                                            {alert.is_all_clear && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                                                                    <CheckCircle2 className="h-3 w-3" />
                                                                    {t('alerts.history.all_clear')}
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                                {alert.alert_type === 'manual'
                                                                    ? '👤 ' + (locale === 'fr' ? 'Manuel' : 'Manual')
                                                                    : '🤖 ' + (locale === 'fr' ? 'Auto' : 'Auto')}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-sm font-semibold text-slate-900 truncate">{alert.title}</h3>
                                                        <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">
                                                            {locale === 'fr' ? alert.message_fr : (alert.title || alert.message_fr)}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0 inline-flex items-center gap-1 text-xs text-slate-400">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {timeAgo(alert.triggered_at, locale)}
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <Stat icon={<Inbox className="h-3 w-3" />} label={t('alerts.history.recipients', { val: alert.total_recipients })} />
                                                    <Stat icon={<Phone className="h-3 w-3" />} label={t('alerts.history.sms', { val: alert.sms_sent })} />
                                                    <Stat icon={<Mail className="h-3 w-3" />} label={t('alerts.history.email', { val: alert.email_sent })} />
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ───────── Helpers ───────── */

function StepIndicator({ current }: { current: Step }) {
    const steps: { key: Step; label: string }[] = [
        { key: 'form', label: '1. Form' },
        { key: 'verify', label: '2. Verify' },
        { key: 'success', label: '3. Done' },
    ];
    const currentIdx = steps.findIndex((s) => s.key === current);
    return (
        <div className="flex items-center gap-2">
            {steps.map((s, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                    <div key={s.key} className="flex items-center gap-2 flex-1">
                        <div className={`flex-1 h-1.5 rounded-full transition-colors ${done ? 'bg-blue-500' : active ? 'bg-gradient-to-r from-blue-500 to-blue-200' : 'bg-slate-200'
                            }`} />
                    </div>
                );
            })}
        </div>
    );
}

function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 ring-1 ring-red-200 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{message}</span>
        </div>
    );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 ring-1 ring-slate-200 text-xs text-slate-600">
            {icon}
            {label}
        </span>
    );
}
