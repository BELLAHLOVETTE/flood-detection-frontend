// src/app/signup/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signup } from '@/lib/auth';
import { useLanguage } from '@/lib/LanguageContext';
import {
    Eye, EyeOff, Lock, User, Mail, Loader2, ArrowLeft, ShieldCheck,
} from 'lucide-react';
import { AuthShell, AuthTabs, Field, ErrorBanner, Divider } from '@/app/login/page';

export default function SignupPage() {
    const router = useRouter();
    const { t } = useLanguage();

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [accept, setAccept] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const strength = useMemo(() => scorePassword(password), [password]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
            return setError(t('signup.error.fields') || 'Please fill in all required fields.');
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return setError(t('signup.error.email') || 'Please enter a valid email address.');
        }
        if (password.length < 8) {
            return setError(t('signup.error.password_short') || 'Password must be at least 8 characters.');
        }
        if (password !== confirmPassword) {
            return setError(t('signup.error.password_mismatch') || 'Passwords do not match.');
        }
        if (!accept) {
            return setError(t('signup.error.terms') || 'Please accept the terms to continue.');
        }

        setLoading(true);
        try {
            const result = await signup({ full_name: fullName, username, email, password });
            if (result.success) {
                toast.success(t('signup.toast.success') || 'Account created — welcome!');
                router.push('/login');
            } else {
                setError(result.error || t('signup.error.failed') || 'Could not create account.');
                setLoading(false);
            }
        } catch {
            setError(t('signup.error.failed') || 'Could not create account.');
            setLoading(false);
        }
    }

    return (
        <AuthShell>
            <AuthTabs active="signup" />

            <div className="mt-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {t('signup.title') || 'Create your account'}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    {t('signup.desc') || 'Join Flood-Watch and stay informed.'}
                </p>
            </div>

            {error && <ErrorBanner message={error} />}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Field
                    id="fullName"
                    label={t('signup.full_name') || 'Full name'}
                    icon={<User className="h-4 w-4" />}
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Jane Doe"
                    autoComplete="name"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                        id="username"
                        label={t('signup.username') || 'Username'}
                        icon={<User className="h-4 w-4" />}
                        value={username}
                        onChange={setUsername}
                        placeholder="janedoe"
                        autoComplete="username"
                    />
                    <Field
                        id="email"
                        type="email"
                        label={t('signup.email') || 'Email'}
                        icon={<Mail className="h-4 w-4" />}
                        value={email}
                        onChange={setEmail}
                        placeholder="you@email.com"
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        {t('signup.password') || 'Password'}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            id="password"
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            aria-label={showPw ? 'Hide password' : 'Show password'}
                        >
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Strength meter */}
                    {password && (
                        <div className="mt-2">
                            <div className="flex gap-1">
                                {[0, 1, 2, 3].map((i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength.score ? strength.color : 'bg-slate-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className={`mt-1 text-xs ${strength.textColor}`}>{strength.label}</p>
                        </div>
                    )}
                </div>

                <Field
                    id="confirmPassword"
                    type={showPw ? 'text' : 'password'}
                    label={t('signup.confirm') || 'Confirm password'}
                    icon={<Lock className="h-4 w-4" />}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="••••••••"
                    autoComplete="new-password"
                />

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={accept}
                        onChange={(e) => setAccept(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-500 leading-relaxed">
                        {t('signup.terms_prefix') || 'I agree to the'}{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                            {t('signup.terms') || 'Terms of Service'}
                        </Link>{' '}
                        {t('signup.and') || 'and'}{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                            {t('signup.privacy') || 'Privacy Policy'}
                        </Link>.
                    </span>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('signup.submitting') || 'Creating account…'}
                        </>
                    ) : (
                        t('signup.submit') || 'Create Account'
                    )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t('signup.secured') || 'Your data is encrypted and protected.'}
                </p>
            </form>

            <Divider label={t('signup.or') || 'or'} />

            <p className="text-center text-sm text-slate-500">
                {t('signup.have_account') || 'Already have an account?'}{' '}
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                    {t('signup.signin') || 'Sign in'}
                </Link>
            </p>

            <div className="mt-6 text-center">
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {t('login.back') || 'Back to site'}
                </Link>
            </div>
        </AuthShell>
    );
}

/* Password strength scoring */
function scorePassword(pw: string) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const map = [
        { label: 'Too short', color: 'bg-red-400', textColor: 'text-red-500' },
        { label: 'Weak', color: 'bg-orange-400', textColor: 'text-orange-500' },
        { label: 'Fair', color: 'bg-amber-400', textColor: 'text-amber-600' },
        { label: 'Good', color: 'bg-lime-500', textColor: 'text-lime-600' },
        { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    ];
    return { score, ...map[score] };
}
