'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { getAdminSubscribers, type AdminSubscriber } from '@/lib/api';

// ── Language (English primary, French toggle — self-contained) ────────────────
type Lang = 'en' | 'fr';

const TR = {
    en: {
        back: 'Back to admin', title: 'Subscribers',
        subtitle: 'People registered to receive flood alerts for Maga.',
        total: 'Total', verified: 'Verified', active: 'Active', reach: 'Email-reachable',
        search: 'Search area, channel or contact', all: 'All', pendingF: 'Pending',
        contact: 'Contact', channel: 'Channel', lang: 'Lang', area: 'Area',
        status: 'Status', joined: 'Joined', last: 'Last alert', never: 'never',
        empty: 'No subscribers yet.',
        emptyHint: 'They will appear here once people register on the Alerts page.',
        active2: 'Active', inactive: 'Inactive', pending: 'Pending', refresh: 'Refresh',
        showing: 'showing',
    },
    fr: {
        back: 'Retour admin', title: 'Abonnés',
        subtitle: 'Personnes inscrites pour recevoir les alertes d’inondation à Maga.',
        total: 'Total', verified: 'Vérifiés', active: 'Actifs', reach: 'Joignables e-mail',
        search: 'Rechercher zone, canal ou contact', all: 'Tous', pendingF: 'En attente',
        contact: 'Contact', channel: 'Canal', lang: 'Langue', area: 'Zone',
        status: 'Statut', joined: 'Inscrit', last: 'Dernière alerte', never: 'jamais',
        empty: 'Aucun abonné pour l’instant.',
        emptyHint: 'Ils apparaîtront ici dès l’inscription sur la page Alertes.',
        active2: 'Actif', inactive: 'Inactif', pending: 'En attente', refresh: 'Actualiser',
        showing: 'affichés',
    },
} as const;

// ── Minimal custom line icons (thin, monochrome — no icon library) ────────────
const IconBack = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 6l-6 6 6 6" />
    </svg>
);
const IconSearch = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
    </svg>
);
const IconRefresh = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 5v5h-5" />
    </svg>
);

function fmtDate(iso: string | null, lang: Lang): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    } catch { return '—'; }
}

function channelLabel(c: string, lang: Lang): string {
    const map: Record<string, [string, string]> = {
        email: ['Email', 'E-mail'], sms: ['SMS', 'SMS'], both: ['Email + SMS', 'E-mail + SMS'],
    };
    return (map[c]?.[lang === 'fr' ? 1 : 0]) ?? c;
}

function statusOf(s: AdminSubscriber): 'active' | 'inactive' | 'pending' {
    if (!s.is_verified) return 'pending';
    return s.is_active ? 'active' : 'inactive';
}

export default function SubscribersPage() {
    const [lang, setLang] = useState<Lang>('en');
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
    const t = TR[lang];

    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['admin-subscribers'],
        queryFn: getAdminSubscribers,
        refetchInterval: 60_000,
    });

    const subs = data?.subscribers ?? [];
    const stats = data?.stats;

    const filtered = useMemo(() => {
        let rows = subs;
        if (filter === 'verified') rows = rows.filter(s => s.is_verified);
        if (filter === 'pending') rows = rows.filter(s => !s.is_verified);
        const q = query.trim().toLowerCase();
        if (q) {
            rows = rows.filter(s =>
                (s.subscription_area ?? '').toLowerCase().includes(q) ||
                (s.masked_email ?? '').toLowerCase().includes(q) ||
                (s.phone_display ?? '').toLowerCase().includes(q) ||
                s.preferred_channel.toLowerCase().includes(q)
            );
        }
        return rows;
    }, [subs, filter, query]);

    return (
        <div className="min-h-screen bg-[#faf9f7]">
            <Navbar />

            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

                {/* top bar */}
                <div className="flex items-center justify-between mb-9">
                    <Link href="/admin"
                        className="inline-flex items-center gap-1.5 text-[13px] text-stone-500
                       hover:text-stone-900 transition-colors">
                        <IconBack /> {t.back}
                    </Link>
                    <div className="flex items-center gap-1 text-[12px] tracking-wide">
                        <button onClick={() => setLang('en')}
                            className={lang === 'en' ? 'text-stone-900 font-medium' : 'text-stone-400 hover:text-stone-600'}>
                            EN
                        </button>
                        <span className="text-stone-300">/</span>
                        <button onClick={() => setLang('fr')}
                            className={lang === 'fr' ? 'text-stone-900 font-medium' : 'text-stone-400 hover:text-stone-600'}>
                            FR
                        </button>
                    </div>
                </div>

                {/* masthead title */}
                <header className="mb-8">
                    <h1 className="font-serif text-4xl sm:text-[2.7rem] leading-none text-stone-900 tracking-tight">
                        {t.title}
                    </h1>
                    <p className="mt-3 text-[14px] text-stone-500 max-w-lg">{t.subtitle}</p>
                    <div className="mt-6 h-px bg-stone-300" />
                </header>

                {/* masthead stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-200 mb-10
                        border-y border-stone-200">
                    {[
                        { label: t.total, value: stats?.total },
                        { label: t.verified, value: stats?.verified },
                        { label: t.active, value: stats?.active },
                        { label: t.reach, value: stats?.email_reachable },
                    ].map((s, i) => (
                        <div key={i} className="px-4 py-5 first:pl-0">
                            <div className="font-serif text-3xl text-stone-900 tabular-nums leading-none">
                                {isLoading ? '—' : (s.value ?? 0)}
                            </div>
                            <div className="mt-2 text-[10.5px] uppercase tracking-[0.14em] text-stone-400">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 border-b border-stone-300 pb-1.5 flex-1
                          focus-within:border-stone-900 transition-colors">
                        <span className="text-stone-400"><IconSearch /></span>
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={t.search}
                            className="w-full bg-transparent text-[14px] text-stone-800
                         placeholder:text-stone-400 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-5 text-[13px]">
                        {(['all', 'verified', 'pending'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`pb-0.5 border-b transition-colors ${filter === f
                                    ? 'text-stone-900 border-stone-900'
                                    : 'text-stone-400 border-transparent hover:text-stone-600'
                                    }`}>
                                {f === 'all' ? t.all : f === 'verified' ? t.verified : t.pendingF}
                            </button>
                        ))}
                        <button onClick={() => refetch()}
                            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-900
                         transition-colors ml-1">
                            <span className={isFetching ? 'animate-spin' : ''}><IconRefresh /></span>
                        </button>
                    </div>
                </div>

                {/* table */}
                <div className="border-t border-stone-300">
                    {/* header row */}
                    <div className="hidden sm:grid grid-cols-[1.4fr_1fr_0.6fr_1fr_0.9fr_0.9fr]
                          gap-4 py-2.5 text-[10.5px] uppercase tracking-[0.13em] text-stone-400">
                        <div>{t.contact}</div><div>{t.channel}</div><div>{t.lang}</div>
                        <div>{t.area}</div><div>{t.status}</div><div className="text-right">{t.joined}</div>
                    </div>

                    {isLoading ? (
                        <div className="divide-y divide-stone-100">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="py-4">
                                    <div className="h-3.5 w-1/3 bg-stone-100 rounded-sm animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="font-serif text-lg text-stone-700">{t.empty}</p>
                            <p className="mt-1.5 text-[13px] text-stone-400 max-w-xs mx-auto">{t.emptyHint}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-stone-150 border-t border-stone-150">
                            {filtered.map(s => {
                                const st = statusOf(s);
                                return (
                                    <div key={s.id}
                                        className="grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_0.6fr_1fr_0.9fr_0.9fr]
                               gap-x-4 gap-y-1 py-4 items-center group">
                                        {/* contact */}
                                        <div className="font-mono text-[13px] text-stone-800 truncate">
                                            {s.masked_email || s.phone_display || '—'}
                                        </div>
                                        {/* channel */}
                                        <div className="text-[13px] text-stone-600">
                                            {channelLabel(s.preferred_channel, lang)}
                                        </div>
                                        {/* lang */}
                                        <div className="text-[12px] uppercase tracking-wide text-stone-500">
                                            {s.language}
                                        </div>
                                        {/* area */}
                                        <div className="text-[13px] text-stone-600 truncate">
                                            {s.subscription_area || '—'}
                                        </div>
                                        {/* status */}
                                        <div className="flex items-center gap-2 text-[13px]">
                                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${st === 'active' ? 'bg-emerald-600'
                                                : st === 'pending' ? 'border border-stone-400'
                                                    : 'bg-stone-300'
                                                }`} />
                                            <span className="text-stone-600">
                                                {st === 'active' ? t.active2 : st === 'pending' ? t.pending : t.inactive}
                                            </span>
                                        </div>
                                        {/* joined */}
                                        <div className="text-[12.5px] text-stone-400 tabular-nums sm:text-right">
                                            {fmtDate(s.created_at, lang)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* footer count */}
                {!isLoading && filtered.length > 0 && (
                    <p className="mt-5 text-[12px] text-stone-400">
                        {filtered.length} {t.showing}
                    </p>
                )}
            </div>
        </div>
    );
}