// src/app/alerts/page.tsx
'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { subscribeToAlerts, verifyOTP, getAlertHistory } from '@/lib/api';
import { Bell, CheckCircle, Phone, Mail, AlertTriangle, Clock } from 'lucide-react';
import { RISK_CONFIG } from '@/types';
import { formatDate, timeAgo } from '@/lib/utils';
import useSWR from 'swr';

// Step tracker for the subscription flow
type Step = 'form' | 'verify' | 'success';

export default function AlertsPage() {
    // Subscription form state
    const [step, setStep] = useState<Step>('form');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [channel, setChannel] = useState<'sms' | 'email' | 'both'>('sms');
    const [language, setLanguage] = useState<'fr' | 'en'>('fr');
    const [subId, setSubId] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch alert history
    const { data: alerts = [] } = useSWR(
        'alert-history',
        () => getAlertHistory(),
        { refreshInterval: 60000 }
    );

    // Handle subscription form submit
    async function handleSubscribe() {
        setError('');

        if (channel === 'sms' && !phone) {
            setError('Veuillez entrer votre numéro de téléphone.');
            return;
        }
        if (channel === 'email' && !email) {
            setError('Veuillez entrer votre adresse email.');
            return;
        }
        if (channel === 'both' && !phone && !email) {
            setError('Veuillez entrer un numéro de téléphone ou une adresse email.');
            return;
        }

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
                'Une erreur est survenue. Veuillez réessayer.'
            );
        } finally {
            setLoading(false);
        }
    }

    // Handle OTP verification
    async function handleVerify() {
        setError('');
        if (otp.length !== 6) {
            setError('Veuillez entrer le code à 6 chiffres.');
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOTP(subId, otp);
            if (result.verified) {
                setStep('success');
            } else {
                setError(result.error || 'Code invalide ou expiré.');
            }
        } catch {
            setError('Erreur de vérification. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="w-6 h-6 text-blue-600" />
                        Alertes d&apos;inondation
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Inscrivez-vous pour recevoir des alertes automatiques par SMS ou email
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT — Subscription Form */}
                    <div>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                            {/* STEP 1 — Form */}
                            {step === 'form' && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                        S&apos;inscrire aux alertes
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Recevez une alerte immédiate lorsqu&apos;un risque
                                        d&apos;inondation élevé est détecté à Maga.
                                    </p>

                                    {/* Channel Selection */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Comment voulez-vous être alerté?
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: 'sms', label: 'SMS', icon: '📱' },
                                                { value: 'email', label: 'Email', icon: '📧' },
                                                { value: 'both', label: 'SMS + Email', icon: '🔔' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setChannel(opt.value as typeof channel)}
                                                    className={`p-3 rounded-xl border-2 text-center text-sm
                                      font-medium transition-colors ${channel === opt.value
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="text-xl mb-1">{opt.icon}</div>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Phone Input */}
                                    {(channel === 'sms' || channel === 'both') && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Numéro de téléphone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2
                                         w-4 h-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+237 6XX XXX XXX"
                                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300
                                     rounded-xl text-sm focus:outline-none
                                     focus:ring-2 focus:ring-blue-500
                                     focus:border-transparent"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Format international: +237 6XX XXX XXX
                                            </p>
                                        </div>
                                    )}

                                    {/* Email Input */}
                                    {(channel === 'email' || channel === 'both') && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Adresse email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2
                                        w-4 h-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="votre@email.com"
                                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300
                                     rounded-xl text-sm focus:outline-none
                                     focus:ring-2 focus:ring-blue-500
                                     focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Language Selection */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Langue des alertes
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { value: 'fr', label: 'Français' },
                                                { value: 'en', label: 'English' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setLanguage(opt.value as 'fr' | 'en')}
                                                    className={`py-2 rounded-xl border-2 text-sm font-medium
                                      transition-colors ${language === opt.value
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200
                                    rounded-xl flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5
                                                flex-shrink-0" />
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubscribe}
                                        disabled={loading}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl
                               font-semibold text-sm hover:bg-blue-700
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white
                                        border-t-transparent rounded-full animate-spin" />
                                                Envoi du code...
                                            </>
                                        ) : (
                                            <>
                                                <Bell className="w-4 h-4" />
                                                S&apos;inscrire aux alertes
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {/* STEP 2 — OTP Verification */}
                            {step === 'verify' && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full
                                    flex items-center justify-center mx-auto mb-4">
                                            <Phone className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Vérification
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Un code à 6 chiffres a été envoyé à votre
                                            {phone ? ` téléphone (****${phone.slice(-4)})` : ' email'}.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Code de vérification
                                        </label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="123456"
                                            maxLength={6}
                                            className="w-full px-4 py-3 border border-gray-300
                                 rounded-xl text-center text-2xl font-mono
                                 tracking-widest focus:outline-none
                                 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200
                                    rounded-xl">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleVerify}
                                        disabled={loading || otp.length !== 6}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl
                               font-semibold text-sm hover:bg-blue-700
                               disabled:opacity-50 transition-colors"
                                    >
                                        {loading ? 'Vérification...' : 'Confirmer le code'}
                                    </button>

                                    <button
                                        onClick={() => { setStep('form'); setError(''); setOtp(''); }}
                                        className="w-full mt-3 py-2 text-sm text-gray-500
                               hover:text-gray-700 transition-colors"
                                    >
                                        ← Retour
                                    </button>
                                </>
                            )}

                            {/* STEP 3 — Success */}
                            {step === 'success' && (
                                <div className="text-center py-4">
                                    <div className="w-20 h-20 bg-green-100 rounded-full
                                  flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        Inscription réussie!
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Vous recevrez désormais des alertes automatiques
                                        lorsqu&apos;un risque d&apos;inondation élevé ou critique
                                        sera détecté à Maga.
                                    </p>
                                    <div className="bg-green-50 border border-green-200
                                  rounded-xl p-4 text-left mb-6">
                                        <p className="text-sm font-medium text-green-800 mb-2">
                                            Vous serez alerté si:
                                        </p>
                                        <ul className="text-sm text-green-700 space-y-1">
                                            <li>🟠 Le risque passe à Élevé (probabilité &gt; 60%)</li>
                                            <li>🔴 Le risque passe à Critique (probabilité &gt; 80%)</li>
                                            <li>🟢 Le risque revient à Faible (alerte de fin)</li>
                                        </ul>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setStep('form');
                                            setPhone('');
                                            setEmail('');
                                            setOtp('');
                                            setError('');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700
                               font-medium"
                                    >
                                        Inscrire un autre numéro
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* RIGHT — Alert History */}
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 mb-4">
                            Historique des alertes envoyées
                        </h2>

                        {alerts.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100
                              shadow-sm p-8 text-center">
                                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">
                                    Aucune alerte envoyée pour le moment
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Les alertes apparaîtront ici lorsque le système
                                    détectera un risque élevé
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts.map((alert) => {
                                    const config = RISK_CONFIG[alert.risk_level];
                                    return (
                                        <div
                                            key={alert.id}
                                            className={`bg-white rounded-xl border-l-4 shadow-sm p-4
                                  ${alert.is_all_clear
                                                    ? 'border-l-green-400'
                                                    : config.border}`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-semibold
                                             ${config.textColor}`}>
                                                            {config.icon} {config.labelFr}
                                                        </span>
                                                        {alert.is_all_clear && (
                                                            <span className="text-xs text-green-600
                                               bg-green-50 px-1.5 py-0.5
                                               rounded-full">
                                                                ✓ Fin d&apos;alerte
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-400">
                                                            {alert.alert_type === 'manual'
                                                                ? '👤 Manuel'
                                                                : '🤖 Auto'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {alert.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                        {alert.message_fr}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="flex items-center gap-1 text-xs
                                          text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        {timeAgo(alert.triggered_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delivery stats */}
                                            <div className="flex items-center gap-4 mt-3
                                      pt-3 border-t border-gray-50">
                                                <span className="text-xs text-gray-400">
                                                    📨 {alert.total_recipients} destinataires
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    📱 {alert.sms_sent} SMS
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    📧 {alert.email_sent} emails
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}