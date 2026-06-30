// src/app/login/page.tsx
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { login } from '@/lib/auth';
import { registerUser } from '@/lib/api';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Eye, EyeOff, Lock, User, Mail, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'success';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const initialMode: Mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

    const [mode, setMode] = useState<Mode>(initialMode);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [organisation, setOrganisation] = useState('');

    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);

    function switchMode(next: Mode) {
        setMode(next);
        setError('');
    }

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) {
            setError(t('auth.err.fields'));
            return;
        }
        setLoading(true);
        const result = await login({ username, password });
        if (result.success) {
            toast.success(t('auth.toast.signin'));
            router.push('/admin');
        } else {
            setError(result.error || t('auth.err.login'));
            setLoading(false);
        }
    }

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim() || !email.trim()) {
            setError(t('auth.err.signup_required'));
            return;
        }
        if (password.length < 8) {
            setError(t('auth.err.pw_short'));
            return;
        }
        setLoading(true);
        try {
            await registerUser({ username, password, email, organisation });
            setPassword('');
            setMode('success');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr?.response?.data?.error || t('auth.err.signup'));
        } finally {
            setLoading(false);
        }
    }

    async function handleForgot(e: React.FormEvent) {
        e.preventDefault();
        if (!forgotEmail.trim()) return;
        setForgotLoading(true);
        try {
            const { requestPasswordReset } = await import('@/lib/api');
            await requestPasswordReset(forgotEmail.trim());
            setForgotSent(true);
        } catch {
            toast.error(t('auth.forgot.err'));
        } finally {
            setForgotLoading(false);
        }
    }

    function closeForgot() {
        setShowForgot(false);
        setForgotEmail('');
        setForgotSent(false);
    }

    return (
        <div className="min-h-screen flex font-sans">

            {/* ── LEFT: brand panel ─────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--fw-teal), var(--fw-deep))' }}>
                <div className="absolute inset-0 opacity-25"
                    style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.12), transparent 45%)' }} />
                <div className="relative flex flex-col items-center justify-center w-full px-12 text-white text-center">
                    <div className="mb-8 fw-fade">
                        <Image src="/favicon.svg" alt="Flood-Watch" width={120} height={120} priority />
                    </div>
                    <h1 className="text-5xl font-semibold tracking-tight fw-rise">Flood-Watch</h1>
                    <p className="mt-4 text-lg text-white/80 max-w-sm fw-rise fw-d1">
                        {t('auth.brand.tagline')}
                    </p>
                    <ul className="mt-10 space-y-3 text-left fw-rise fw-d2">
                        {[t('auth.brand.feat1'), t('auth.brand.feat2'), t('auth.brand.feat3')].map((f) => (
                            <li key={f} className="flex items-center gap-3 text-white/90">
                                <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--fw-aqua)' }} />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── RIGHT: form panel ─────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative"
                style={{ background: 'var(--fw-paper)' }}>

                {/* language toggle top-right */}
                <div className="absolute top-5 right-5">
                    <LanguageToggle />
                </div>

                <div className="w-full max-w-md">

                    {/* ── SUCCESS state ── */}
                    {mode === 'success' ? (
                        <div className="text-center fw-rise">
                            <div className="mx-auto w-20 h-20 rounded-full grid place-items-center mb-6"
                                style={{ background: 'var(--fw-mist)' }}>
                                <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--fw-teal)' }} />
                            </div>
                            <h2 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--fw-deep)' }}>
                                {t('auth.success.title')}
                            </h2>
                            <p className="mt-3 text-[14px] leading-relaxed max-w-sm mx-auto"
                                style={{ color: 'var(--fw-ink)', opacity: 0.65 }}>
                                {t('auth.success.desc')}
                            </p>

                            <div className="mt-7 text-left rounded-2xl p-5"
                                style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)' }}>
                                <p className="text-[11px] uppercase tracking-[0.16em] mb-3"
                                    style={{ color: 'var(--fw-teal)' }}>
                                    {t('auth.success.next')}
                                </p>
                                <ul className="space-y-2.5 text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.75 }}>
                                    {[t('auth.success.step1'), t('auth.success.step2'), t('auth.success.step3')].map((s, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style={{ background: 'var(--fw-teal)' }} />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button onClick={() => { switchMode('signin'); setUsername(''); }}
                                className="w-full mt-6 py-3 rounded-xl text-white font-medium text-[15px] shadow-lg transition-all hover:-translate-y-px"
                                style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
                                {t('auth.success.goto')}
                            </button>
                            <Link href="/" className="block mt-3 text-center text-[13px]"
                                style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                                {t('auth.success.public')}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="lg:hidden flex flex-col items-center mb-8">
                                <Image src="/favicon.svg" alt="Flood-Watch" width={64} height={64} />
                                <h1 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
                                    Flood-Watch
                                </h1>
                            </div>

                            <div className="flex gap-1 p-1 rounded-full mb-8 w-fit mx-auto"
                                style={{ background: 'var(--fw-mist)' }}>
                                <button onClick={() => switchMode('signin')}
                                    className="px-6 py-2 rounded-full text-[14px] font-medium transition-colors"
                                    style={mode === 'signin'
                                        ? { background: '#fff', color: 'var(--fw-deep)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                                        : { color: 'var(--fw-ink)', opacity: 0.6 }}>
                                    {t('auth.tab.signin')}
                                </button>
                                <button onClick={() => switchMode('signup')}
                                    className="px-6 py-2 rounded-full text-[14px] font-medium transition-colors"
                                    style={mode === 'signup'
                                        ? { background: '#fff', color: 'var(--fw-deep)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                                        : { color: 'var(--fw-ink)', opacity: 0.6 }}>
                                    {t('auth.tab.signup')}
                                </button>
                            </div>

                            <div className="text-center mb-7">
                                <h2 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--fw-deep)' }}>
                                    {mode === 'signin' ? t('auth.signin.title') : t('auth.signup.title')}
                                </h2>
                                <p className="mt-1.5 text-[14px]" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                                    {mode === 'signin' ? t('auth.signin.sub') : t('auth.signup.sub')}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5"
                                    style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                                    <p className="text-[13.5px]" style={{ color: '#991b1b' }}>{error}</p>
                                </div>
                            )}

                            {mode === 'signin' && (
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <Field icon={<User className="w-4 h-4" />} placeholder={t('auth.field.username')}
                                        value={username} onChange={setUsername} autoComplete="username" />
                                    <PasswordField placeholder={t('auth.field.password')} value={password} onChange={setPassword}
                                        show={showPw} toggle={() => setShowPw(!showPw)} />
                                    <div className="text-right">
                                        <button type="button"
                                            onClick={() => setShowForgot(true)}
                                            className="text-[13px]" style={{ color: 'var(--fw-teal)' }}>
                                            {t('auth.forgot')}
                                        </button>
                                    </div>
                                    <SubmitButton loading={loading} label={t('auth.btn.signin')} waitLabel={t('auth.btn.wait')} />
                                </form>
                            )}

                            {mode === 'signup' && (
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <Field icon={<User className="w-4 h-4" />} placeholder={t('auth.field.username')}
                                        value={username} onChange={setUsername} autoComplete="username" />
                                    <Field icon={<Mail className="w-4 h-4" />} placeholder={t('auth.field.email')} type="email"
                                        value={email} onChange={setEmail} autoComplete="email" />
                                    <Field icon={<Building2 className="w-4 h-4" />} placeholder={t('auth.field.org')}
                                        value={organisation} onChange={setOrganisation} />
                                    <PasswordField placeholder={t('auth.field.password')} value={password} onChange={setPassword}
                                        show={showPw} toggle={() => setShowPw(!showPw)} />
                                    <SubmitButton loading={loading} label={t('auth.btn.signup')} waitLabel={t('auth.btn.wait')} />
                                </form>
                            )}

                            <div className="mt-6 text-center text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.65 }}>
                                {mode === 'signin' ? (
                                    <>{t('auth.no_account')}{' '}
                                        <button onClick={() => switchMode('signup')}
                                            className="font-medium" style={{ color: 'var(--fw-teal)' }}>
                                            {t('auth.link.signup')}
                                        </button>
                                    </>
                                ) : (
                                    <>{t('auth.have_account')}{' '}
                                        <button onClick={() => switchMode('signin')}
                                            className="font-medium" style={{ color: 'var(--fw-teal)' }}>
                                            {t('auth.link.signin')}
                                        </button>
                                    </>
                                )}
                            </div>

                            <Link href="/" className="block mt-4 text-center text-[12.5px]"
                                style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                {t('auth.back_public')}
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* ── Forgot-password modal ── */}
            {showForgot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(10,52,56,0.45)', backdropFilter: 'blur(6px)' }}
                    onClick={closeForgot}>
                    <div onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-2xl p-7 fw-rise"
                        style={{ background: '#fff', boxShadow: '0 20px 60px rgba(10,52,56,0.25)' }}>

                        {forgotSent ? (
                            <div className="text-center">
                                <div className="mx-auto w-14 h-14 rounded-full grid place-items-center mb-4"
                                    style={{ background: 'var(--fw-mist)' }}>
                                    <CheckCircle2 className="w-7 h-7" style={{ color: 'var(--fw-teal)' }} />
                                </div>
                                <h3 className="text-xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
                                    {t('auth.forgot.sent.title')}
                                </h3>
                                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--fw-ink)', opacity: 0.65 }}>
                                    {t('auth.forgot.sent.desc')}
                                </p>
                                <button onClick={closeForgot}
                                    className="w-full mt-6 py-2.5 rounded-xl text-white font-medium text-[14px] transition-all hover:-translate-y-px"
                                    style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
                                    {t('auth.forgot.done')}
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
                                    {t('auth.forgot.title')}
                                </h3>
                                <p className="mt-1.5 text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                                    {t('auth.forgot.desc')}
                                </p>

                                <form onSubmit={handleForgot} className="mt-5 space-y-4">
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2"
                                            style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                                            <Mail className="w-4 h-4" />
                                        </span>
                                        <input type="email" value={forgotEmail} autoFocus
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] outline-none transition-all"
                                            style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)', color: 'var(--fw-ink)' }}
                                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--fw-teal)'; e.currentTarget.style.background = '#fff'; }}
                                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--fw-line)'; e.currentTarget.style.background = 'var(--fw-mist)'; }} />
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="button" onClick={closeForgot}
                                            className="flex-1 py-2.5 rounded-xl font-medium text-[14px] transition-colors"
                                            style={{ background: 'var(--fw-mist)', color: 'var(--fw-deep)' }}>
                                            {t('auth.forgot.cancel')}
                                        </button>
                                        <button type="submit" disabled={forgotLoading}
                                            className="flex-1 py-2.5 rounded-xl text-white font-medium text-[14px] transition-all hover:-translate-y-px disabled:opacity-60 flex items-center justify-center gap-2"
                                            style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
                                            {forgotLoading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                                            {forgotLoading ? t('auth.forgot.sending') : t('auth.forgot.send')}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'var(--fw-paper)' }}>
                <div className="w-8 h-8 rounded-full border-[3px] animate-spin"
                    style={{ borderColor: 'var(--fw-line)', borderTopColor: 'var(--fw-teal)' }} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

function Field({ icon, placeholder, value, onChange, type = 'text', autoComplete }: {
    icon: React.ReactNode; placeholder: string; value: string;
    onChange: (v: string) => void; type?: string; autoComplete?: string;
}) {
    return (
        <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>{icon}</span>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder} autoComplete={autoComplete}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] outline-none transition-all"
                style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)', color: 'var(--fw-ink)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--fw-teal)'; e.currentTarget.style.background = '#fff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--fw-line)'; e.currentTarget.style.background = 'var(--fw-mist)'; }} />
        </div>
    );
}

function PasswordField({ placeholder, value, onChange, show, toggle }: {
    placeholder: string; value: string; onChange: (v: string) => void; show: boolean; toggle: () => void;
}) {
    return (
        <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--fw-ink)', opacity: 0.4 }}><Lock className="w-4 h-4" /></span>
            <input type={show ? 'text' : 'password'} value={value}
                onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete="current-password"
                className="w-full pl-10 pr-11 py-3 rounded-xl text-[14px] outline-none transition-all"
                style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)', color: 'var(--fw-ink)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--fw-teal)'; e.currentTarget.style.background = '#fff'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--fw-line)'; e.currentTarget.style.background = 'var(--fw-mist)'; }} />
            <button type="button" onClick={toggle}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
}

function SubmitButton({ loading, label, waitLabel }: { loading: boolean; label: string; waitLabel: string }) {
    return (
        <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium text-[15px] shadow-lg transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? waitLabel : label}
        </button>
    );
}