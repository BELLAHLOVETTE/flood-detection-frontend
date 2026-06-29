'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { getAdminSubscribers, type AdminSubscriber } from '@/lib/api';

type Lang = 'en' | 'fr';

const TR = {
    en: {
        back: 'Back to admin', eyebrow: 'Authority console', title: 'Subscribers',
        subtitle: 'People registered to receive flood alerts for Maga.',
        total: 'Total', verified: 'Verified', active: 'Active', reach: 'Email-reachable',
        search: 'Search area, channel or contact', all: 'All', pendingF: 'Pending',
        contact: 'Contact', channel: 'Channel', lang: 'Lang', area: 'Area',
        status: 'Status', joined: 'Joined',
        empty: 'No subscribers yet.',
        emptyHint: 'They will appear here once people register on the Alerts page.',
        active2: 'Active', inactive: 'Inactive', pending: 'Pending', showing: 'showing',
    },
    fr: {
        back: 'Retour admin', eyebrow: 'Console autorité', title: 'Abonnés',
        subtitle: 'Personnes inscrites pour recevoir les alertes d’inondation à Maga.',
        total: 'Total', verified: 'Vérifiés', active: 'Actifs', reach: 'Joignables e-mail',
        search: 'Rechercher zone, canal ou contact', all: 'Tous', pendingF: 'En attente',
        contact: 'Contact', channel: 'Canal', lang: 'Langue', area: 'Zone',
        status: 'Statut', joined: 'Inscrit',
        empty: 'Aucun abonné pour l’instant.',
        emptyHint: 'Ils apparaîtront ici dès l’inscription sur la page Alertes.',
        active2: 'Actif', inactive: 'Inactif', pending: 'En attente', showing: 'affichés',
    },
} as const;

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
        <div className="min-h-screen font-sans" style={{ background: 'var(--fw-paper)' }}>
            <Navbar />

            <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">

                {/* top bar */}
                <div className="flex items-center justify-between mb-8 fw-rise">
                    <Link href="/admin"
                        className="inline-flex items-center gap-1.5 text-[13px] transition-colors"
                        style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                        <IconBack /> {t.back}
                    </Link>
                    <div className="flex items-center gap-1.5 text-[12px] tracking-wide">
                        <button onClick={() => setLang('en')}
                            style={{ color: lang === 'en' ? 'var(--fw-deep)' : 'var(--fw-ink)', opacity: lang === 'en' ? 1 : 0.45, fontWeight: lang === 'en' ? 600 : 400 }}>
                            EN
                        </button>
                        <span style={{ color: 'var(--fw-line)' }}>/</span>
                        <button onClick={() => setLang('fr')}
                            style={{ color: lang === 'fr' ? 'var(--fw-deep)' : 'var(--fw-ink)', opacity: lang === 'fr' ? 1 : 0.45, fontWeight: lang === 'fr' ? 600 : 400 }}>
                            FR
                        </button>
                    </div>
                </div>

                {/* header */}
                <header className="mb-8 fw-rise fw-d1">
                    <p className="text-[12px] tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--fw-teal)' }}>
                        {t.eyebrow}
                    </p>
                    <h1 className="text-3xl sm:text-[2.4rem] font-semibold tracking-tight leading-none"
                        style={{ color: 'var(--fw-deep)' }}>
                        {t.title}
                    </h1>
                    <p className="mt-3 text-[14px] max-w-lg" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                        {t.subtitle}
                    </p>
                </header>

                {/* stats strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-y mb-10 fw-rise fw-d2"
                    style={{ borderColor: 'var(--fw-line)' }}>
                    {[
                        { label: t.total, value: stats?.total, accent: 'var(--fw-deep)' },
                        { label: t.verified, value: stats?.verified, accent: 'var(--fw-teal)' },
                        { label: t.active, value: stats?.active, accent: 'var(--fw-teal)' },
                        { label: t.reach, value: stats?.email_reachable, accent: 'var(--fw-deep)' },
                    ].map((s, i) => (
                        <div key={i} className={`px-4 py-5 ${i < 3 ? 'border-r' : ''} ${i < 2 ? 'border-b sm:border-b-0' : ''}`}
                            style={{ borderColor: 'var(--fw-line)' }}>
                            <div className="text-3xl font-semibold tabular-nums leading-none" style={{ color: s.accent }}>
                                {isLoading ? '—' : (s.value ?? 0)}
                            </div>
                            <div className="mt-2 text-[10.5px] uppercase tracking-[0.14em]"
                                style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 border-b pb-1.5 flex-1 transition-colors focus-within:border-[var(--fw-teal)]"
                        style={{ borderColor: 'var(--fw-line)' }}>
                        <span style={{ color: 'var(--fw-ink)', opacity: 0.4 }}><IconSearch /></span>
                        <input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder={t.search}
                            className="w-full bg-transparent text-[14px] outline-none"
                            style={{ color: 'var(--fw-ink)' }}
                        />
                    </div>

                    <div className="flex items-center gap-5 text-[13px]">
                        {(['all', 'verified', 'pending'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className="pb-0.5 border-b transition-colors"
                                style={filter === f
                                    ? { color: 'var(--fw-deep)', borderColor: 'var(--fw-teal)' }
                                    : { color: 'var(--fw-ink)', opacity: 0.45, borderColor: 'transparent' }}>
                                {f === 'all' ? t.all : f === 'verified' ? t.verified : t.pendingF}
                            </button>
                        ))}
                        <button onClick={() => refetch()}
                            className="inline-flex items-center gap-1.5 ml-1 transition-colors"
                            style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                            <span className={isFetching ? 'animate-spin' : ''}><IconRefresh /></span>
                        </button>
                    </div>
                </div>

                {/* table */}
                <div className="border-t" style={{ borderColor: 'var(--fw-line)' }}>
                    {/* header row */}
                    <div className="hidden sm:grid grid-cols-[1.4fr_1fr_0.6fr_1fr_0.9fr_0.9fr] gap-4 py-3 text-[10.5px] uppercase tracking-[0.13em]"
                        style={{ color: 'var(--fw-ink)', opacity: 0.4 }}>
                        <div>{t.contact}</div><div>{t.channel}</div><div>{t.lang}</div>
                        <div>{t.area}</div><div>{t.status}</div><div className="text-right">{t.joined}</div>
                    </div>

                    {isLoading ? (
                        <div className="divide-y" style={{ borderColor: 'var(--fw-line)' }}>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="py-4">
                                    <div className="h-3.5 w-1/3 rounded-sm animate-pulse" style={{ background: 'var(--fw-mist)' }} />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-lg font-medium" style={{ color: 'var(--fw-deep)' }}>{t.empty}</p>
                            <p className="mt-1.5 text-[13px] max-w-xs mx-auto" style={{ color: 'var(--fw-ink)', opacity: 0.5 }}>
                                {t.emptyHint}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y" style={{ borderColor: 'var(--fw-line)' }}>
                            {filtered.map((s, idx) => {
                                const st = statusOf(s);
                                const dot = st === 'active' ? 'var(--fw-teal)' : st === 'pending' ? 'transparent' : 'var(--fw-line)';
                                return (
                                    <div key={s.id}
                                        className={`grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_0.6fr_1fr_0.9fr_0.9fr] gap-x-4 gap-y-1 py-4 items-center transition-colors hover:bg-[var(--fw-mist)] -mx-3 px-3 rounded-lg fw-rise fw-d${Math.min(idx + 1, 4)}`}>
                                        <div className="font-mono text-[13px] truncate" style={{ color: 'var(--fw-deep)' }}>
                                            {s.masked_email || s.phone_display || '—'}
                                        </div>
                                        <div className="text-[13px]" style={{ color: 'var(--fw-ink)', opacity: 0.7 }}>
                                            {channelLabel(s.preferred_channel, lang)}
                                        </div>
                                        <div className="text-[12px] uppercase tracking-wide" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                                            {s.language}
                                        </div>
                                        <div className="text-[13px] truncate" style={{ color: 'var(--fw-ink)', opacity: 0.7 }}>
                                            {s.subscription_area || '—'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[13px]">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full"
                                                style={st === 'pending'
                                                    ? { border: '1px solid var(--fw-ink)', opacity: 0.4 }
                                                    : { background: dot }} />
                                            <span style={{ color: 'var(--fw-ink)', opacity: 0.7 }}>
                                                {st === 'active' ? t.active2 : st === 'pending' ? t.pending : t.inactive}
                                            </span>
                                        </div>
                                        <div className="text-[12.5px] tabular-nums sm:text-right" style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                                            {fmtDate(s.created_at, lang)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {!isLoading && filtered.length > 0 && (
                    <p className="mt-5 text-[12px]" style={{ color: 'var(--fw-ink)', opacity: 0.45 }}>
                        {filtered.length} {t.showing}
                    </p>
                )}
            </div>
        </div>
    );
}