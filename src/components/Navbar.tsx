// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { isAuthenticated, logout } from '@/lib/auth';
import {
    LayoutDashboard, Map, History, Bell, AlertTriangle,
    Menu, X, LogIn, LogOut, Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

const navLinks = [
    { href: '/', key: 'nav.dashboard' as const, icon: LayoutDashboard },
    { href: '/map', key: 'nav.map' as const, icon: Map },
    { href: '/history', key: 'nav.history' as const, icon: History },
    { href: '/alerts', key: 'nav.alerts' as const, icon: Bell },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        setAuthed(isAuthenticated());
    }, [pathname]);

    async function handleLogout() {
        await logout();
        setAuthed(false);
        toast.success(t('toast.logout_success'));
        router.push('/');
    }

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800
                            rounded-xl flex items-center justify-center shadow-sm">
                            <AlertTriangle className="w-4.5 h-4.5 text-white w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">
                                Flood-Watch
                            </p>
                            <p className="text-xs text-gray-400 leading-none mt-1">
                                {t('nav.cameroon')}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, key, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm',
                                        'font-medium transition-all duration-150',
                                        active
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {t(key)}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Toggle */}
                        <LanguageToggle />

                        {/* Live indicator */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            {t('nav.live')}
                        </div>

                        {/* Auth button */}
                        {authed ? (
                            <div className="flex items-center gap-2">
                                <Link href="/admin"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                             font-medium text-blue-700 bg-blue-50 rounded-lg
                             hover:bg-blue-100 transition-colors">
                                    <Shield className="w-3.5 h-3.5" />
                                    {t('nav.admin')}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                             font-medium text-gray-500 hover:text-red-600
                             hover:bg-red-50 rounded-lg transition-colors">
                                    <LogOut className="w-3.5 h-3.5" />
                                    {t('nav.logout')}
                                </button>
                            </div>
                        ) : (
                            <Link href="/login"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                           font-medium text-gray-600 border border-gray-200
                           rounded-lg hover:bg-gray-50 transition-colors">
                                <LogIn className="w-3.5 h-3.5" />
                                {t('nav.login')}
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="flex items-center gap-2 md:hidden">
                        <LanguageToggle />
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-lg text-gray-500
                           hover:bg-gray-100 transition-colors"
                            aria-label="Menu"
                        >
                            {open
                                ? <X className="w-5 h-5" />
                                : <Menu className="w-5 h-5" />
                            }
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden border-t border-gray-100 bg-white
                        animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ href, key, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm',
                                        'font-medium transition-colors',
                                        active
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {t(key)}
                                </Link>
                            );
                        })}

                        <div className="pt-2 border-t border-gray-100 mt-2">
                            {authed ? (
                                <>
                                    <Link href="/admin" onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                text-sm font-medium text-blue-700 hover:bg-blue-50">
                                        <Shield className="w-4 h-4" />
                                        {t('nav.adminDashboard')}
                                    </Link>
                                    <button onClick={() => { handleLogout(); setOpen(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                text-sm font-medium text-red-600 hover:bg-red-50">
                                        <LogOut className="w-4 h-4" />
                                        {t('nav.logout')}
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                             text-sm font-medium text-gray-600 hover:bg-gray-50">
                                    <LogIn className="w-4 h-4" />
                                    {t('nav.loginAdmin')}
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </nav>
    );
}