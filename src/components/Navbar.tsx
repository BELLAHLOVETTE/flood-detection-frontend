// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { isAuthenticated, logout } from '@/lib/auth';
import toast from 'react-hot-toast';
import {
    LayoutDashboard, Map, History, Bell,
    Menu, X, LogIn, LogOut, Shield, TrendingUp, Info,
} from 'lucide-react';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
        <nav className="sticky top-0 z-50 border-b backdrop-blur-md"
            style={{
                background: 'rgba(251, 253, 253, 0.85)',
                borderColor: 'var(--fw-line)',
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                        <Image
                            src="/logo-mark.svg"
                            alt="Flood-Watch"
                            width={32}
                            height={32}
                            className="transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="hidden sm:block leading-tight">
                            <p className="text-[14px] font-semibold leading-none"
                                style={{ color: 'var(--fw-deep)' }}>
                                Flood-Watch
                            </p>
                            <p className="text-[11px] leading-none mt-0.5"
                                style={{ color: 'var(--fw-teal)' }}>
                                Cameroon
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-0.5">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13.5px] font-medium transition-colors duration-150"
                                    style={
                                        active
                                            ? { background: 'var(--fw-mist)', color: 'var(--fw-deep)' }
                                            : { color: 'var(--fw-ink)', opacity: 0.6 }
                                    }
                                    onMouseEnter={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.opacity = '1';
                                            e.currentTarget.style.color = 'var(--fw-deep)';
                                            e.currentTarget.style.background = 'var(--fw-mist)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) {
                                            e.currentTarget.style.opacity = '0.6';
                                            e.currentTarget.style.color = 'var(--fw-ink)';
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop right side */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[11.5px]"
                            style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                                    style={{ background: 'var(--fw-aqua)' }} />
                                <span className="relative inline-flex h-2 w-2 rounded-full"
                                    style={{ background: 'var(--fw-teal)' }} />
                            </span>
                            Live — Maga
                        </div>

                        {authed ? (
                            <>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12.5px] font-medium rounded-full transition-colors"
                                    style={{ background: 'var(--fw-mist)', color: 'var(--fw-deep)' }}
                                >
                                    <Shield className="w-3.5 h-3.5" />
                                    Admin
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium rounded-full transition-colors hover:bg-[var(--fw-mist)]"
                                    style={{ color: 'var(--fw-ink)', opacity: 0.6 }}
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 px-4 py-1.5 text-[12.5px] font-medium rounded-full border transition-colors hover:bg-[var(--fw-mist)]"
                                style={{ borderColor: 'var(--fw-line)', color: 'var(--fw-deep)' }}
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 rounded-lg transition-colors hover:bg-[var(--fw-mist)]"
                        style={{ color: 'var(--fw-deep)' }}
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t"
                    style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                                    style={
                                        active
                                            ? { background: 'var(--fw-mist)', color: 'var(--fw-deep)' }
                                            : { color: 'var(--fw-ink)', opacity: 0.7 }
                                    }
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            );
                        })}

                        <div className="pt-2 border-t mt-2 space-y-1"
                            style={{ borderColor: 'var(--fw-line)' }}>
                            {authed ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                                        style={{ color: 'var(--fw-deep)' }}
                                    >
                                        <Shield className="w-4 h-4" />
                                        Admin Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                                        style={{ color: '#c2410c' }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                                        style={{ color: 'var(--fw-ink)' }}
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                                        style={{ color: 'var(--fw-teal)' }}
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