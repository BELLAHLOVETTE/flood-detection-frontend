// src/app/about/page.tsx
'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import {
    Satellite, Brain, Bell, Map,
    Shield, Database, TrendingUp,
    AlertTriangle,
} from 'lucide-react';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen font-sans" style={{ background: 'var(--fw-paper)' }}>
            <Navbar />

            {/* Hero banner */}
            <div className="text-white" style={{ background: 'linear-gradient(to bottom right, var(--fw-teal), var(--fw-deep))' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}>
                        <Satellite className="w-4 h-4" />
                        {t('about.badge')}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight tracking-tight">
                        Flood-Watch Cameroon
                    </h1>
                    <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10 text-white/80">
                        {t('about.hero.desc')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/dashboard"
                            className="px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                            style={{ background: '#fff', color: 'var(--fw-deep)' }}>
                            <TrendingUp className="w-4 h-4" />
                            {t('about.cta.dashboard')}
                        </Link>
                        <Link href="/forecast"
                            className="px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 text-white"
                            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)' }}>
                            <AlertTriangle className="w-4 h-4" />
                            {t('about.cta.forecast')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Impact stats */}
            <div className="border-b" style={{ background: 'var(--fw-paper)', borderColor: 'var(--fw-line)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <Stat number="100,000+" label={t('about.stat.2019')} />
                        <Stat number="25,000+" label={t('about.stat.2022')} />
                        <Stat number="18,000+" label={t('about.stat.2024')} />
                    </div>
                    <p className="text-center text-sm mt-6 max-w-2xl mx-auto"
                        style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                        {t('about.stat.note')}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

                {/* How it works */}
                <section>
                    <p className="text-[12px] tracking-[0.18em] uppercase text-center mb-2"
                        style={{ color: 'var(--fw-teal)' }}>
                        {t('about.how.eyebrow')}
                    </p>
                    <h2 className="text-2xl font-semibold text-center mb-2 tracking-tight"
                        style={{ color: 'var(--fw-deep)' }}>
                        {t('about.how.title')}
                    </h2>
                    <p className="text-center text-sm mb-10" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                        {t('about.how.sub')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <HowCard step="01" stepLabel={t('about.step')} icon={<Satellite className="w-6 h-6" />}
                            title={t('about.how.1.title')} desc={t('about.how.1.desc')} />
                        <HowCard step="02" stepLabel={t('about.step')} icon={<Database className="w-6 h-6" />}
                            title={t('about.how.2.title')} desc={t('about.how.2.desc')} />
                        <HowCard step="03" stepLabel={t('about.step')} icon={<Brain className="w-6 h-6" />}
                            title={t('about.how.3.title')} desc={t('about.how.3.desc')} />
                        <HowCard step="04" stepLabel={t('about.step')} icon={<Bell className="w-6 h-6" />}
                            title={t('about.how.4.title')} desc={t('about.how.4.desc')} />
                    </div>
                </section>

                {/* Data sources */}
                <section>
                    <h2 className="text-2xl font-semibold text-center mb-10 tracking-tight"
                        style={{ color: 'var(--fw-deep)' }}>
                        {t('about.data.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <DataCard name="Sentinel-1 SAR" org="ESA / Copernicus"
                            desc={t('about.data.sentinel')} tag={t('about.data.free')} icon="🛰️" />
                        <DataCard name="CHIRPS Rainfall" org="UCSB Climate Hazards Group"
                            desc={t('about.data.chirps')} tag={t('about.data.free')} icon="🌧️" />
                        <DataCard name="JRC Surface Water" org="Joint Research Centre (EU)"
                            desc={t('about.data.jrc')} tag={t('about.data.free')} icon="💧" />
                        <DataCard name="SRTM Elevation" org="NASA / USGS"
                            desc={t('about.data.srtm')} tag={t('about.data.free')} icon="⛰️" />
                        <DataCard name="NOAA GFS Forecast" org="NOAA / NCEP"
                            desc={t('about.data.gfs')} tag={t('about.data.free')} icon="🌤️" />
                        <DataCard name="UNOSAT Flood Records" org="UNITAR / UNOSAT"
                            desc={t('about.data.unosat')} tag={t('about.data.opendata')} icon="🗺️" />
                    </div>
                </section>

                {/* Features */}
                <section>
                    <h2 className="text-2xl font-semibold text-center mb-10 tracking-tight"
                        style={{ color: 'var(--fw-deep)' }}>
                        {t('about.feat.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FeatureCard icon={<TrendingUp className="w-5 h-5" />}
                            title={t('about.feat.1.title')} desc={t('about.feat.1.desc')} />
                        <FeatureCard icon={<Map className="w-5 h-5" />}
                            title={t('about.feat.2.title')} desc={t('about.feat.2.desc')} />
                        <FeatureCard icon={<Bell className="w-5 h-5" />}
                            title={t('about.feat.3.title')} desc={t('about.feat.3.desc')} />
                        <FeatureCard icon={<Shield className="w-5 h-5" />}
                            title={t('about.feat.4.title')} desc={t('about.feat.4.desc')} />
                    </div>
                </section>

                {/* Tech stack */}
                <section>
                    <div className="rounded-3xl p-8 text-white" style={{ background: 'var(--fw-deep)' }}>
                        <h2 className="text-xl font-semibold text-center mb-8">
                            {t('about.tech.title')}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Google Earth Engine', desc: t('about.tech.gee'), emoji: '🌍' },
                                { label: 'Sentinel-1 SAR', desc: t('about.tech.sar'), emoji: '📡' },
                                { label: 'Random Forest ML', desc: t('about.tech.ml'), emoji: '🤖' },
                                { label: 'Django + DRF', desc: t('about.tech.django'), emoji: '🐍' },
                                { label: 'Next.js', desc: t('about.tech.next'), emoji: '⚡' },
                                { label: 'WebSockets', desc: t('about.tech.ws'), emoji: '🔌' },
                                { label: 'PostgreSQL', desc: t('about.tech.pg'), emoji: '🗄️' },
                                { label: 'SendGrid', desc: t('about.tech.sendgrid'), emoji: '✉️' },
                            ].map((item, i) => (
                                <div key={i} className="rounded-xl p-4 text-center"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <div className="text-2xl mb-2">{item.emoji}</div>
                                    <p className="text-sm font-medium text-white">{item.label}</p>
                                    <p className="text-xs text-white/55 mt-0.5">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Academic context */}
                <section className="text-center">
                    <h2 className="text-xl font-semibold mb-3 tracking-tight" style={{ color: 'var(--fw-deep)' }}>
                        {t('about.academic.title')}
                    </h2>
                    <p className="text-sm max-w-2xl mx-auto leading-relaxed"
                        style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                        {t('about.academic.desc')}
                    </p>
                    <div className="flex justify-center gap-3 mt-6">
                        <Link href="/dashboard"
                            className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-colors"
                            style={{ background: 'var(--fw-teal)' }}>
                            {t('about.academic.open')}
                        </Link>
                        <Link href="/forecast"
                            className="px-5 py-2.5 rounded-full text-sm font-medium border transition-colors"
                            style={{ borderColor: 'var(--fw-line)', color: 'var(--fw-deep)' }}>
                            {t('about.academic.forecast')}
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}

function Stat({ number, label }: { number: string; label: string }) {
    return (
        <div>
            <p className="text-4xl font-semibold tabular-nums" style={{ color: 'var(--fw-deep)' }}>{number}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>{label}</p>
        </div>
    );
}

function HowCard({ step, stepLabel, icon, title, desc }: {
    step: string; stepLabel: string; icon: React.ReactNode; title: string; desc: string;
}) {
    return (
        <div className="rounded-2xl border p-6 transition-shadow hover:shadow-md"
            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
            <div className="inline-flex p-3 rounded-xl mb-4"
                style={{ background: 'var(--fw-mist)', color: 'var(--fw-teal)' }}>
                {icon}
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--fw-teal)' }}>{stepLabel} {step}</p>
            <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fw-deep)' }}>{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fw-ink)', opacity: 0.65 }}>{desc}</p>
        </div>
    );
}

function DataCard({ name, org, desc, tag, icon }: {
    name: string; org: string; desc: string; tag: string; icon: string;
}) {
    return (
        <div className="rounded-xl border p-5 transition-shadow hover:shadow-md"
            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
            <div className="text-2xl mb-3">{icon}</div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--fw-deep)' }}>{name}</h3>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--fw-teal)' }}>{org}</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>{desc}</p>
            <span className="text-xs px-2 py-0.5 rounded-full border font-medium"
                style={{ color: 'var(--fw-teal)', background: 'var(--fw-mist)', borderColor: 'var(--fw-line)' }}>
                ✓ {tag}
            </span>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: {
    icon: React.ReactNode; title: string; desc: string;
}) {
    return (
        <div className="rounded-xl border p-5 transition-shadow hover:shadow-md flex gap-4"
            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--fw-mist)', color: 'var(--fw-teal)' }}>
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--fw-deep)' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>{desc}</p>
            </div>
        </div>
    );
}