// src/app/signup/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/lib/api';
import toast from 'react-hot-toast';
import {
    Eye, EyeOff, AlertTriangle, Lock,
    User, Mail, Building2, CheckCircle, Shield,
} from 'lucide-react';

interface FormState {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    organisation: string;
}

export default function SignupPage() {
    const [form, setForm] = useState<FormState>({
        username: '', password: '', confirmPassword: '',
        email: '', organisation: '',
    });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function update(field: keyof FormState, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!form.username.trim()) {
            setError('Username is required.'); return;
        }
        if (!form.email.trim()) {
            setError('Email is required.'); return;
        }
        if (!form.password) {
            setError('Password is required.'); return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.'); return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.'); return;
        }

        setLoading(true);
        try {
            await registerUser({
                username: form.username.trim(),
                password: form.password,
                email: form.email.trim(),
                organisation: form.organisation.trim(),
            });
            setSuccess(true);
            toast.success('Account created successfully!');
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: { data?: { error?: string } }
            };
            setError(
                axiosErr?.response?.data?.error ||
                'An error occurred. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }

    // Success screen
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950
                      to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center
                          justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Account Created!
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Your account has been created successfully. An administrator
                        must approve your access before you can log into the
                        administration dashboard.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                            What happens next?
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>An admin will review your account</li>
                            <li>You will receive an email when approved</li>
                            <li>You can then log in to the admin dashboard</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <Link href="/login"
                            className="block w-full py-3 bg-blue-600 text-white rounded-xl
                         font-semibold text-sm hover:bg-blue-700 transition-colors">
                            Go to Login
                        </Link>
                        <Link href="/"
                            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl
                         font-semibold text-sm hover:bg-gray-200 transition-colors">
                            View Public Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950
                    to-slate-900 flex items-center justify-center p-4">

            {/* Background glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10
                        rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10
                        rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center
                            justify-center mx-auto mb-4">
                            <Shield className="w-9 h-9 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Flood-Watch</h1>
                        <p className="text-blue-200 text-sm mt-1">
                            Create an authority account
                        </p>
                    </div>

                    <div className="p-8">
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Reserved for government officials, NGO staff, and researchers.
                            Your account will be verified by a system administrator
                            before access is granted.
                        </p>

                        {error && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200
                              rounded-xl flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={e => update('username', e.target.value)}
                                        placeholder="john.doe"
                                        autoComplete="username"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                               text-sm bg-gray-50 focus:bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => update('email', e.target.value)}
                                        placeholder="john@ministry.cm"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                               text-sm bg-gray-50 focus:bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Organisation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Organisation
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2
                                        w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={form.organisation}
                                        onChange={e => update('organisation', e.target.value)}
                                        placeholder="NADH, ONACC, Red Cross, University..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                               text-sm bg-gray-50 focus:bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={e => update('password', e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        autoComplete="new-password"
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl
                               text-sm bg-gray-50 focus:bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2
                               text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPw
                                            ? <EyeOff className="w-4 h-4" />
                                            : <Eye className="w-4 h-4" />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Confirm password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={e => update('confirmPassword', e.target.value)}
                                        placeholder="Repeat your password"
                                        autoComplete="new-password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                               text-sm bg-gray-50 focus:bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700
                           text-white rounded-xl font-semibold text-sm
                           hover:from-blue-700 hover:to-blue-800
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all shadow-lg shadow-blue-500/25
                           flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                    rounded-full animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link href="/login"
                                    className="text-blue-600 font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                            <Link href="/"
                                className="block text-xs text-gray-400 hover:text-blue-600
                           transition-colors">
                                ← Back to public dashboard
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}