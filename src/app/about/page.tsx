// src/app/about/page.tsx
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
    Satellite, Brain, Bell, Map,
    Shield, Database, TrendingUp,
    AlertTriangle,
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen font-sans" style={{ background: 'var(--fw-paper)' }}>
            <Navbar />

            {/* Hero banner */}
            <div className="text-white" style={{ background: 'linear-gradient(to bottom right, var(--fw-teal), var(--fw-deep))' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff' }}>
                        <Satellite className="w-4 h-4" />
                        Remote sensing early warning system
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-semibold mb-6 leading-tight tracking-tight">
                        Flood-Watch Cameroon
                    </h1>
                    <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10 text-white/80">
                        A satellite-powered flood detection and early warning system
                        for Maga Sub-Division, Far North Cameroon — protecting communities
                        with machine learning and space technology.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/dashboard"
                            className="px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
                            style={{ background: '#fff', color: 'var(--fw-deep)' }}>
                            <TrendingUp className="w-4 h-4" />
                            Open dashboard
                        </Link>
                        <Link href="/forecast"
                            className="px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 text-white"
                            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)' }}>
                            <AlertTriangle className="w-4 h-4" />
                            7-day forecast
                        </Link>
                    </div>
                </div>
            </div>

            {/* Impact stats */}
            <div className="border-b" style={{ background: 'var(--fw-paper)', borderColor: 'var(--fw-line)' }}>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <Stat number="100,000+" label="People affected in 2019" />
                        <Stat number="25,000+" label="People affected in 2022" />
                        <Stat number="18,000+" label="People affected in 2024" />
                    </div>
                    <p className="text-center text-sm mt-6 max-w-2xl mx-auto"
                        style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                        Maga Sub-Division is one of the most flood-prone regions in Cameroon.
                        Annual flooding from the Logone River and Lake Maga affects tens of
                        thousands of people every rainy season between July and October.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

                {/* How it works */}
                <section>
                    <p className="text-[12px] tracking-[0.18em] uppercase text-center mb-2"
                        style={{ color: 'var(--fw-teal)' }}>
                        End to end
                    </p>
                    <h2 className="text-2xl font-semibold text-center mb-2 tracking-tight"
                        style={{ color: 'var(--fw-deep)' }}>
                        How the system works
                    </h2>
                    <p className="text-center text-sm mb-10" style={{ color: 'var(--fw-ink)', opacity: 0.55 }}>
                        From satellite image to alert
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <HowCard step="01" icon={<Satellite className="w-6 h-6" />}
                            title="Satellite acquisition"
                            desc="Sentinel-1 C-band SAR radar captures images of the Maga region every 12 days — through clouds, at night, in any weather." />
                        <HowCard step="02" icon={<Database className="w-6 h-6" />}
                            title="Google Earth Engine"
                            desc="GEE processes raw radar images using SAR change detection, and extracts CHIRPS rainfall and JRC water surface data automatically." />
                        <HowCard step="03" icon={<Brain className="w-6 h-6" />}
                            title="ML risk assessment"
                            desc="A Random Forest model trained on 25 years of data (2000–2025) calculates flood probability using 11 environmental indicators." />
                        <HowCard step="04" icon={<Bell className="w-6 h-6" />}
                            title="Early warning alert"
                            desc="When risk exceeds the alert threshold, email alerts are dispatched to all verified subscribers." />
                    </div>
                </section>

                {/* Data sources */}
                <section>
                    <h2 className="text-2xl font-semibold text-center mb-10 tracking-tight"
                        style={{ color: 'var(--fw-deep)' }}>
                        Data sources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <DataCard name="Sentinel-1 SAR" org="ESA / Copernicus"
                            desc="C-band radar imagery at 10m resolution. 12-day revisit. Penetrates cloud cover — essential for rainy season monitoring."
                            tag="Free via Google Earth Engine" icon="🛰️" />
                        <DataCard name="CHIRPS Rainfall" org="UCSB Climate Hazards Group"
                            desc="Daily rainfall records from 1981 to present at 5.5km resolution. Primary data source for ML training and forecast baseline."
                            tag="Free via Google Earth Engine" icon="🌧️" />
                        <DataCard name="JRC Surface Water" org="Joint Research Centre (EU)"
                            desc="Monthly water surface extent since 1984 at 30m resolution. Used to track Lake Maga water levels and detect permanent water."
                            tag="Free via Google Earth Engine" icon="💧" />
                        <DataCard name="SRTM Elevation" org="NASA / USGS"
                            desc="30m digital elevation model. Used to mask steep slopes from flood detection and identify low-lying flood-prone areas."
                            tag="Free via Google Earth Engine" icon="⛰️" />
                        <DataCard name="NOAA GFS Forecast" org="NOAA / NCEP"
                            desc="Global atmospheric forecast model at 27km resolution. Combined with CHIRPS seasonal data to produce 7-day rainfall predictions."
                            tag="Free via Google Earth Engine" icon="🌤️" />
                        <DataCard name="UNOSAT Flood Records" org="UNITAR / UNOSAT"
                            desc="UN-validated historical flood maps. Used to label training data for the ML model and verify detection accuracy."
                            tag="Open data (UN)" icon="🗺️" />
                    </div>
                </section>

                {/* Features */}
                <section>
                    <h2 className="text-2xl font-semibold text-center mb-10 tracking-tight"
                        style={{ color: 'var(--fw-deep)' }}>
                        System features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FeatureCard icon={<TrendingUp className="w-5 h-5" />}
                            title="7-day flood forecast"
                            desc="ML-powered probability forecast for the next 7 days, combining GFS atmospheric data with CHIRPS seasonal climatology." />
                        <FeatureCard icon={<Map className="w-5 h-5" />}
                            title="Interactive flood map"
                            desc="Sentinel-1 SAR flood extent overlaid on a Leaflet map with village risk markers and satellite base layers." />
                        <FeatureCard icon={<Bell className="w-5 h-5" />}
                            title="Email alerts"
                            desc="OTP-verified subscriber system. Alerts in English and French when risk reaches High or Critical level." />
                        <FeatureCard icon={<Shield className="w-5 h-5" />}
                            title="Authority dashboard"
                            desc="Secure admin interface for government officials and NGOs. Manual alert dispatch, system health, subscriber management." />
                    </div>
                </section>

                {/* Tech stack */}
                <section>
                    <div className="rounded-3xl p-8 text-white" style={{ background: 'var(--fw-deep)' }}>
                        <h2 className="text-xl font-semibold text-center mb-8">
                            Technology stack
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Google Earth Engine', desc: 'Satellite processing', emoji: '🌍' },
                                { label: 'Sentinel-1 SAR', desc: 'Radar detection', emoji: '📡' },
                                { label: 'Random Forest ML', desc: 'Risk prediction', emoji: '🤖' },
                                { label: 'Django + DRF', desc: 'REST API backend', emoji: '🐍' },
                                { label: 'Next.js', desc: 'React frontend', emoji: '⚡' },
                                { label: 'WebSockets', desc: 'Real-time updates', emoji: '🔌' },
                                { label: 'PostgreSQL', desc: 'Production database', emoji: '🗄️' },
                                { label: 'SendGrid', desc: 'Email delivery', emoji: '✉️' },
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
                        Academic context
                    </h2>
                    <p className="text-sm max-w-2xl mx-auto leading-relaxed"
                        style={{ color: 'var(--fw-ink)', opacity: 0.6 }}>
                        This system was developed as a final year engineering project.
                        It demonstrates how satellite remote sensing and machine learning
                        can be applied to protect vulnerable communities from natural
                        disasters in the Cameroonian context. All satellite data is
                        freely available through Google Earth Engine.
                    </p>
                    <div className="flex justify-center gap-3 mt-6">
                        <Link href="/dashboard"
                            className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-colors"
                            style={{ background: 'var(--fw-teal)' }}>
                            Open the system →
                        </Link>
                        <Link href="/forecast"
                            className="px-5 py-2.5 rounded-full text-sm font-medium border transition-colors"
                            style={{ borderColor: 'var(--fw-line)', color: 'var(--fw-deep)' }}>
                            View forecast
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

function HowCard({ step, icon, title, desc }: {
    step: string; icon: React.ReactNode; title: string; desc: string;
}) {
    return (
        <div className="rounded-2xl border p-6 transition-shadow hover:shadow-md"
            style={{ borderColor: 'var(--fw-line)', background: 'var(--fw-paper)' }}>
            <div className="inline-flex p-3 rounded-xl mb-4"
                style={{ background: 'var(--fw-mist)', color: 'var(--fw-teal)' }}>
                {icon}
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--fw-teal)' }}>STEP {step}</p>
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