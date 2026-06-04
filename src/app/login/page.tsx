// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Droplets, AlertTriangle, Lock, User } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true);
        const result = await login(username, password);

        if (result.success) {
            toast.success('Connexion réussie!');
            router.push('/admin');
        } else {
            setError(result.error || 'Erreur de connexion.');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900
                    flex items-center justify-center p-4">

            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10
                        rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10
                        rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">

                {/* Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl
                        border border-white/20 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center
                            justify-center mx-auto mb-4">
                            <Droplets className="w-9 h-9 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white" suppressHydrationWarning>Flood-Watch</h1>
                        <p className="text-blue-200 text-sm mt-1" suppressHydrationWarning>
                            Système d&apos;alerte précoce — Cameroun
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1" suppressHydrationWarning>
                            Connexion Administration
                        </h2>
                        <p className="text-sm text-gray-500 mb-6" suppressHydrationWarning>
                            Accès réservé aux autorités et administrateurs
                        </p>

                        {error && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl
                              flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5" suppressHydrationWarning>
                                    Nom d&apos;utilisateur
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="admin"
                                        autoComplete="username"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl
                               text-sm bg-gray-50 focus:bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5" suppressHydrationWarning>
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   w-4 h-4 text-gray-400" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl
                               text-sm bg-gray-50 focus:bg-white focus:outline-none
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all"
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

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700
                           text-white rounded-xl font-semibold text-sm
                           hover:from-blue-700 hover:to-blue-800
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 flex items-center justify-center
                           gap-2 shadow-lg shadow-blue-500/25"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white
                                    rounded-full animate-spin" />
                                        Connexion en cours...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>

                        </form>

                        {/* Back to public site */}
                        <div className="mt-6 text-center">
                            <Link href="/"
                                className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                                ← Retour au tableau de bord public
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Note */}
                <p className="text-center text-xs text-slate-500 mt-4" suppressHydrationWarning>
                    Accès public disponible sur la page d&apos;accueil sans connexion
                </p>

            </div>
        </div>
    );
}