// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Map,
    History,
    Bell,
    AlertTriangle,
} from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Tableau de bord', labelEn: 'Dashboard', icon: LayoutDashboard },
    { href: '/map', label: 'Carte', labelEn: 'Map', icon: Map },
    { href: '/history', label: 'Historique', labelEn: 'History', icon: History },
    { href: '/alerts', label: 'Alertes', labelEn: 'Alerts', icon: Bell },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none">
                                Flood-Watch
                            </p>
                            <p className="text-xs text-gray-500 leading-none">
                                Cameroun
                            </p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1">
                        {navLinks.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Region Badge */}
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Maga, Extrême-Nord
                    </div>

                </div>
            </div>
        </nav>
    );
}