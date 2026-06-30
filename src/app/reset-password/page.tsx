'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { confirmPasswordReset } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Eye, EyeOff, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

function ResetContent() {
    const params = useSearchParams();
    const router = useRouter();
    const { t } = useLanguage();
    const uid = params.get('uid') || '';
    const token = params.get('token') || '';

    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        if (password.length < 8) { setError(t('reset.pw_short')); return; }
        setLoading(true);
        try {
            await confirmPasswordReset(uid, token, password);
            setDone(true);
        } catch (err: unknown) {
            const ax = err as { response?: { data?: { error?: string } } };
            setError(ax?.response?.data?.error || t('reset.err'));
        } finally {
            setLoading(false);
        }
    }

    const invalidLink = !uid || !token;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-sans relative"
            style={{ background: 'var(--fw-paper)' }}>
            <div className="absolute top-5 right-5">
                <LanguageToggle />
            </div>
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <Image src="/favicon.svg" alt="Flood-Watch" width={64} height={64} />
                    <h1 className="mt-3 text-2xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
                        Flood-Watch
                    </h1>
                </div>

                {done ? (
                    <div className="text-center fw-rise">
                        <div className="mx-auto w-16 h-16 rounded-full grid place-items-center mb-5"
                            style={{ background: 'var(--fw-mist)' }}>
                            <CheckCircle2 className="w-9 h-9" style={{ color: 'var(--fw-teal)' }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
                            {t('reset.done.title')}
                        </h2>
                        <p className="mt-2 text-[14px]" style={{ color: 'var(--fw-ink)', opacity: 0.65 }}>
                            {t('reset.done.desc')}
                        </p>
                        <button onClick={() => router.push('/login')}
                            className="w-full mt-6 py-3 rounded-xl text-white font-medium text-[15px] shadow-lg transition-all hover:-translate-y-px"
                            style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
                            {t('reset.goto')}
                        </button>
                    </div>
                ) : invalidLink ? (
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-full grid place-items-center mb-5"
                            style={{ background: '#fef2f2' }}>
                            <AlertTriangle className="w-8 h-8" style={{ color: '#dc2626' }} />
                        </div>
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
                            {t('reset.invalid.title')}
                        </h2>
                        <p className="mt-2 text-[14px]" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                            {t('reset.invalid.desc')}
                        </p>
                        <Link href="/login" className="inline-block mt-5 text-[14px] font-medium"
                            style={{ color: 'var(--fw-teal)' }}>
                            {t('reset.back')}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-7">
                            <h2 className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--fw-deep)' }}>
                                {t('reset.title')}
                            </h2>
                            <p className="mt-1.5 text-[14px]" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                                {t('reset.sub')}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5"
                                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#dc2626' }} />
                                <p className="text-[13.5px]" style={{ color: '#991b1b' }}>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input type={showPw ? 'text' : 'password'} value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('reset.placeholder')} autoComplete="new-password"
                                    className="w-full pl-10 pr-11 py-3 rounded-xl text-[14px] outline-none transition-all"
                                    style={{ background: 'var(--fw-mist)', border: '1px solid var(--fw-line)', color: 'var(--fw-ink)' }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--fw-teal)'; e.currentTarget.style.background = '#fff'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--fw-line)'; e.currentTarget.style.background = 'var(--fw-mist)'; }} />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full py-3 rounded-xl text-white font-medium text-[15px] shadow-lg transition-all hover:-translate-y-px disabled:opacity-60 flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(to right, var(--fw-teal), var(--fw-aqua))' }}>
                                {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                                {loading ? t('reset.btn.loading') : t('reset.btn')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fw-paper)' }}>
                <div className="w-8 h-8 rounded-full border-[3px] animate-spin"
                    style={{ borderColor: 'var(--fw-line)', borderTopColor: 'var(--fw-teal)' }} />
            </div>
        }>
            <ResetContent />
        </Suspense>
    );
}