// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { login } from '@/lib/auth';
import { registerUser } from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, User, Mail, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'success';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialMode: Mode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

    const [mode, setMode] = useState<Mode>(initialMode);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [organisation, setOrganisation] = useState('');

    function switchMode(next: Mode) {
        setMode(next);
        setError('');
    }

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        const result = await login({ username, password });
        if (result.success) {
            toast.success('Signed in successfully');
            router.push('/admin');
        } else {
            setError(result.error || 'Login failed. Please try again.');
            setLoading(false);
        }
    }

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (!username.trim() || !password.trim() || !email.trim()) {
            setError('Username, email, and password are required.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            await registerUser({ username, password, email, organisation });
            setPassword('');
            setMode('success');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            setError(axiosErr?.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        Satellite flood monitoring &amp; early warning for safer communities
                    </p>
                    <ul className="mt-10 space-y-3 text-left fw-rise fw-d2">
                        {['Live flood risk map', 'Email alerts in English & French', '25 years of rainfall data'].map((f) => (
                            <li key={f} className="flex items-center gap-3 text-white/90">
                                <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--fw-aqua)' }} />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ── RIGHT: form panel ─────────────────────────── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10"
                style={{ background: 'var(--fw-paper)' }}>
                <div className="w-full max-w-md">

                    {/* ── SUCCESS state ── */}
                    {mode === 'success' ? (
                        <div className="text-center fw-rise">
                            <div className="mx-auto w-20 h-20 rounded-full grid place-items-center mb-6"
                                style={{ background: 'var(--fw-mist)' }}>
                                <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--fw-teal)' }} />
                            </div>
                            <h2 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--fw-deep)' }}>
                                Account created
                            </h2>
                            <p className="mt-3 text-[14px] leading-relaxed max-w-sm mx-auto"
                                style={{ color: 'var(--fw-ink)', opacity: 0.65 }}>
                                Your account has been created successfully. An administrator must
                                approve your access before you can sign in to the dashboard.
                            </p>

                            <div className="mt-7 text-left rounded-2xl p-5"
                                style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)' }}>
                                <p className="text-[11px] uppercase tracking-[0.16em] mb-3"
                                    style={{ color: 'var(--fw-teal)' }}>
                                    What happens next
                                </p>
                                <ul className="space-y-2.5 text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.75 }}>
                                    {[
                                        'An administrator reviews your account',
                                        'You receive an email once approved',
                                        'You can then sign in to the dashboard',
                                    ].map((s, i) => (
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
                                Go to sign in
                            </button>
                            <Link href="/" className="block mt-3 text-center text-[13px]"
                                style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                                View public site
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* mobile logo */}
                            <div className="lg:hidden flex flex-col items-center mb-8">
                                <Image src="/favicon.svg" alt="Flood-Watch" width={64} height={64} />
                                <h1 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
                                    Flood-Watch
                                </h1>
                            </div>

                            {/* tab switch */}
                            <div className="flex gap-1 p-1 rounded-full mb-8 w-fit mx-auto"
                                style={{ background: 'var(--fw-mist)' }}>
                                <button onClick={() => switchMode('signin')}
                                    className="px-6 py-2 rounded-full text-[14px] font-medium transition-colors"
                                    style={mode === 'signin'
                                        ? { background: '#fff', color: 'var(--fw-deep)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                                        : { color: 'var(--fw-ink)', opacity: 0.6 }}>
                                    Sign In
                                </button>
                                <button onClick={() => switchMode('signup')}
                                    className="px-6 py-2 rounded-full text-[14px] font-medium transition-colors"
                                    style={mode === 'signup'
                                        ? { background: '#fff', color: 'var(--fw-deep)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                                        : { color: 'var(--fw-ink)', opacity: 0.6 }}>
                                    Sign Up
                                </button>
                            </div>

                            <div className="text-center mb-7">
                                <h2 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--fw-deep)' }}>
                                    {mode === 'signin' ? 'Welcome back' : 'Create account'}
                                </h2>
                                <p className="mt-1.5 text-[14px]" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                                    {mode === 'signin'
                                        ? 'Sign in to your admin dashboard'
                                        : 'Register as an authority or analyst'}
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
                                    <Field icon={<User className="w-4 h-4" />} placeholder="Username"
                                        value={username} onChange={setUsername} autoComplete="username" />
                                    <PasswordField value={password} onChange={setPassword}
                                        show={showPw} toggle={() => setShowPw(!showPw)} />
                                    <div className="text-right">
                                        <span className="text-[13px] cursor-default" style={{ color: 'var(--fw-teal)', opacity: 0.7 }}>
                                            Forgot password?
                                        </span>
                                    </div>
                                    <SubmitButton loading={loading} label="Sign In" />
                                </form>
                            )}

                            {mode === 'signup' && (
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <Field icon={<User className="w-4 h-4" />} placeholder="Username"
                                        value={username} onChange={setUsername} autoComplete="username" />
                                    <Field icon={<Mail className="w-4 h-4" />} placeholder="Email" type="email"
                                        value={email} onChange={setEmail} autoComplete="email" />
                                    <Field icon={<Building2 className="w-4 h-4" />} placeholder="Organisation (optional)"
                                        value={organisation} onChange={setOrganisation} />
                                    <PasswordField value={password} onChange={setPassword}
                                        show={showPw} toggle={() => setShowPw(!showPw)} />
                                    <SubmitButton loading={loading} label="Create Account" />
                                </form>
                            )}

                            <div className="mt-6 text-center text-[13.5px]" style={{ color: 'var(--fw-ink)', opacity: 0.65 }}>
                                {mode === 'signin' ? (
                                    <>Don&apos;t have an account?{' '}
                                        <button onClick={() => switchMode('signup')}
                                            className="font-medium" style={{ color: 'var(--fw-teal)' }}>
                                            Sign up
                                        </button>
                                    </>
                                ) : (
                                    <>Already have an account?{' '}
                                        <button onClick={() => switchMode('signin')}
                                            className="font-medium" style={{ color: 'var(--fw-teal)' }}>
                                            Sign in
                                        </button>
                                    </>
                                )}
                            </div>

                            <Link href="/" className="block mt-4 text-center text-[12.5px]"
                                style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                ← Back to public site
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
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

function PasswordField({ value, onChange, show, toggle }: {
    value: string; onChange: (v: string) => void; show: boolean; toggle: () => void;
}) {
    return (
        <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--fw-ink)', opacity: 0.4 }}><Lock className="w-4 h-4" /></span>
            <input type={show ? 'text' : 'password'} value={value}
                onChange={(e) => onChange(e.target.value)} placeholder="Password" autoComplete="current-password"
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

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium text-[15px] shadow-lg transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
            {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? 'Please wait…' : label}
        </button>
    );
}