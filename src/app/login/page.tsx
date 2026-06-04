// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { login } from '@/lib/auth';
import { useLanguage } from '@/lib/LanguageContext';
import {
    Eye, EyeOff, Droplets, AlertTriangle, Lock, User, Loader2,
    CheckCircle2, ArrowLeft,
} from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError(t('login.error.fields'));
            return;
        }

        setLoading(true);
        const result = await login(username, password);

        if (result.success) {
            toast.success(t('login.toast.success'));
            router.push('/admin');
        } else {
            setError(result.error || t('login.error.failed'));
            setLoading(false);
        }
    }

    return (
        <AuthShell>
            <AuthTabs active="login" />

            <div className="mt-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {t('login.title') || 'Welcome back'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    {t('login.desc') || 'Sign in to your admin dashboard'}
                </p>
            </div>

            {error && <ErrorBanner message={error} />}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Field
                    id="username"
                    label={t('login.username')}
                    icon={<User className="h-4 w-4" />}
                    value={username}
                    onChange={setUsername}
                    placeholder="admin"
                    autoComplete="username"
                />

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        {t('login.password')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            id="password"
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label={showPw ? 'Hide password' : 'Show password'}
                        >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <div className="mt-2 flex justify-end">
                        <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                            {t('login.forgot') || 'Forgot password?'}
                        </Link>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('login.submitting')}
                        </>
                    ) : (
                        t('login.submit') || 'Sign In'
                    )}
                </button>
            </form>

            <Divider label={t('login.or') || 'or'} />

            <p className="text-center text-sm text-slate-500">
                {t('login.no_account') || "Don't have an account?"}{' '}
                <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                    {t('login.signup') || 'Sign up'}
                </Link>
            </p>

            <div className="mt-6 text-center">
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {t('login.back')}
                </Link>
            </div>
        </AuthShell>
    );
}

/* ─────────── Shared shell + helpers (used by login & signup) ─────────── */

export function AuthShell({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
            {/* LEFT — Brand panel */}
            <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 text-white p-12">
                <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.25), transparent 45%)',
                    }}
                />
                <div className="relative">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30 shadow-xl">
                        <Droplets className="h-9 w-9" />
                    </div>
                    <h2 className="mt-8 text-5xl font-bold tracking-tight">Flood-Watch</h2>
                    <p className="mt-3 text-lg text-white/90 max-w-md">
                        {t('auth.tagline') || 'Real-time flood monitoring & alerts for safer communities.'}
                    </p>

                    <ul className="mt-10 space-y-3 text-white/90">
                        {[
                            t('auth.feature.map') || 'Live flood risk map',
                            t('auth.feature.alerts') || 'SMS & Email alerts',
                            t('auth.feature.reports') || 'Community reports',
                        ].map((f) => (
                            <li key={f} className="flex items-center gap-2.5">
                                <span className="h-6 w-6 grid place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                </span>
                                <span className="text-sm">{f}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-white/70">
                    © {new Date().getFullYear()} Flood-Watch · {t('auth.legal') || 'Protecting communities together'}
                </p>
            </aside>

            {/* RIGHT — Form panel */}
            <main className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex flex-col items-center mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 grid place-items-center text-white shadow-lg">
                            <Droplets className="h-7 w-7" />
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-900">Flood-Watch</p>
                    </div>

                    <div className="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 p-7 sm:p-9">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

export function AuthTabs({ active }: { active: 'login' | 'signup' }) {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <Link
                href="/login"
                className={`py-2 text-center text-sm font-semibold rounded-lg transition-all ${active === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                {t('auth.tab.signin') || 'Sign In'}
            </Link>
            <Link
                href="/signup"
                className={`py-2 text-center text-sm font-semibold rounded-lg transition-all ${active === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
            >
                {t('auth.tab.signup') || 'Sign Up'}
            </Link>
        </div>
    );
}

export function Field({
    id, label, icon, value, onChange, placeholder, type = 'text', autoComplete, hint,
}: {
    id: string;
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    autoComplete?: string;
    hint?: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
            </div>
            {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
        </div>
    );
}

export function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 ring-1 ring-red-200 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{message}</span>
        </div>
    );
}

export function Divider({ label }: { label: string }) {
    return (
        <div className="my-5 flex items-center gap-3">
            <span className="flex-1 h-px bg-slate-200" />
            <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
            <span className="flex-1 h-px bg-slate-200" />
        </div>
    );
}
