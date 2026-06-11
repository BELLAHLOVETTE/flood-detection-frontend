// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { isAuthenticated, logout } from '@/lib/auth';
import toast from 'react-hot-toast';
import {
    LayoutDashboard, Map, History, Bell,
    AlertTriangle, Menu, X, LogIn, LogOut,
    Shield, TrendingUp, Info,
} from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/forecast', label: 'Forecast', icon: TrendingUp },
    { href: '/map', label: 'Map', icon: Map },
    { href: '/history', label: 'History', icon: History },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        setAuthed(isAuthenticated());
    }, [pathname]);

    // Close mobile menu when route changes
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    async function handleLogout() {
        await logout();
        setAuthed(false);
        toast.success('Logged out successfully');
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
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none">
                                Flood-Watch
                            </p>
                            <p className="text-xs text-gray-400 leading-none">
                                Cameroon
                            </p>
                        </div>
                    </Link>

                    {/* Desktop navigation links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label, icon: Icon }) => {
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
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop right side */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Live indicator */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Live — Maga
                        </div>

                        {authed ? (
                            <>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                             font-medium text-blue-700 bg-blue-50 rounded-lg
                             hover:bg-blue-100 transition-colors"
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    Admin
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                             font-medium text-gray-500 hover:text-red-600
                             hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                           font-medium text-gray-600 border border-gray-200
                           rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 rounded-lg text-gray-500
                       hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm',
                                        'font-medium transition-colors',
                                        active
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            );
                        })}

                        <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
                            {authed ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                               text-sm font-medium text-blue-700 hover:bg-blue-50"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Admin Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5
                               rounded-xl text-sm font-medium text-red-600
                               hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                               text-sm font-medium text-gray-600 hover:bg-gray-50"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                               text-sm font-medium text-blue-600 hover:bg-blue-50"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Register as Authority
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}