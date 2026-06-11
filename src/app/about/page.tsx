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
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero banner */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700/50
                          border border-blue-500 rounded-full text-blue-200 text-sm
                          font-medium mb-6">
                        <Satellite className="w-4 h-4" />
                        Remote Sensing Early Warning System
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
                        Flood-Watch Cameroon
                    </h1>
                    <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed mb-10">
                        A satellite-powered flood detection and early warning system
                        for Maga Sub-Division, Far North Cameroon — protecting communities
                        with AI and space technology.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/"
                            className="px-6 py-3 bg-white text-blue-900 rounded-xl font-semibold
                         hover:bg-blue-50 transition-colors flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Open Dashboard
                        </Link>
                        <Link href="/forecast"
                            className="px-6 py-3 bg-blue-700/50 text-white border border-blue-400
                         rounded-xl font-semibold hover:bg-blue-700 transition-colors
                         flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            7-Day Forecast
                        </Link>
                    </div>
                </div>
            </div>

            {/* Impact stats */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <Stat number="100,000+" label="People affected in 2019" color="text-red-600" />
                        <Stat number="25,000+" label="People affected in 2022" color="text-orange-600" />
                        <Stat number="18,000+" label="People affected in 2024" color="text-yellow-600" />
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6 max-w-2xl mx-auto">
                        Maga Sub-Division is one of the most flood-prone regions in Cameroon.
                        Annual flooding from the Logone River and Lake Maga affects tens of
                        thousands of people every rainy season between July and October.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

                {/* How it works */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                        How the System Works
                    </h2>
                    <p className="text-gray-500 text-center text-sm mb-10">
                        End-to-end pipeline from satellite image to SMS alert
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <HowCard
                            step="01"
                            icon={<Satellite className="w-6 h-6 text-blue-600" />}
                            title="Satellite Acquisition"
                            desc="Sentinel-1 C-band SAR radar captures images of the Maga region every 12 days — through clouds, at night, in any weather."
                            bg="bg-blue-50"
                        />
                        <HowCard
                            step="02"
                            icon={<Database className="w-6 h-6 text-teal-600" />}
                            title="Google Earth Engine"
                            desc="GEE processes raw radar images using SAR change detection, extracts CHIRPS rainfall and JRC water surface data automatically."
                            bg="bg-teal-50"
                        />
                        <HowCard
                            step="03"
                            icon={<Brain className="w-6 h-6 text-purple-600" />}
                            title="ML Risk Assessment"
                            desc="A Random Forest model trained on 25 years of data (2000–2025) calculates flood probability using 11 environmental indicators."
                            bg="bg-purple-50"
                        />
                        <HowCard
                            step="04"
                            icon={<Bell className="w-6 h-6 text-orange-600" />}
                            title="Early Warning Alert"
                            desc="When risk exceeds the alert threshold, SMS and email alerts are automatically dispatched to all verified subscribers."
                            bg="bg-orange-50"
                        />
                    </div>
                </section>

                {/* Data sources */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
                        Data Sources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <DataCard
                            name="Sentinel-1 SAR"
                            org="ESA / Copernicus"
                            desc="C-band radar imagery at 10m resolution. 12-day revisit. Penetrates cloud cover — essential for rainy season monitoring."
                            tag="Free via Google Earth Engine"
                            icon="🛰️"
                        />
                        <DataCard
                            name="CHIRPS Rainfall"
                            org="UCSB Climate Hazards Group"
                            desc="Daily rainfall records from 1981 to present at 5.5km resolution. Primary data source for ML training and forecast baseline."
                            tag="Free via Google Earth Engine"
                            icon="🌧️"
                        />
                        <DataCard
                            name="JRC Surface Water"
                            org="Joint Research Centre (EU)"
                            desc="Monthly water surface extent since 1984 at 30m resolution. Used to track Lake Maga water levels and detect permanent water."
                            tag="Free via Google Earth Engine"
                            icon="💧"
                        />
                        <DataCard
                            name="SRTM Elevation"
                            org="NASA / USGS"
                            desc="30m digital elevation model. Used to mask steep slopes from flood detection and identify low-lying flood-prone areas."
                            tag="Free via Google Earth Engine"
                            icon="⛰️"
                        />
                        <DataCard
                            name="NOAA GFS Forecast"
                            org="NOAA / NCEP"
                            desc="Global atmospheric forecast model at 27km resolution. Combined with CHIRPS seasonal data to produce 7-day rainfall predictions."
                            tag="Free via Google Earth Engine"
                            icon="🌤️"
                        />
                        <DataCard
                            name="UNOSAT Flood Records"
                            org="UNITAR / UNOSAT"
                            desc="UN-validated historical flood maps. Used to label training data for the ML model and verify detection accuracy."
                            tag="Open data (UN)"
                            icon="🗺️"
                        />
                    </div>
                </section>

                {/* Features */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
                        System Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FeatureCard
                            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                            title="7-Day Flood Forecast"
                            bg="bg-blue-50"
                            desc="ML-powered probability forecast for the next 7 days, combining GFS atmospheric data with CHIRPS seasonal climatology."
                        />
                        <FeatureCard
                            icon={<Map className="w-5 h-5 text-teal-600" />}
                            title="Interactive Flood Map"
                            bg="bg-teal-50"
                            desc="Real-time Sentinel-1 SAR flood extent overlaid on Leaflet map with village risk markers and satellite base layers."
                        />
                        <FeatureCard
                            icon={<Bell className="w-5 h-5 text-orange-600" />}
                            title="SMS and Email Alerts"
                            bg="bg-orange-50"
                            desc="OTP-verified subscriber system. Automatic alerts in English and French when risk reaches High or Critical level."
                        />
                        <FeatureCard
                            icon={<Shield className="w-5 h-5 text-purple-600" />}
                            title="Authority Dashboard"
                            bg="bg-purple-50"
                            desc="Secure admin interface for government officials and NGOs. Manual alert dispatch, system health monitoring, subscriber management."
                        />
                    </div>
                </section>

                {/* Tech stack */}
                <section>
                    <div className="bg-slate-900 rounded-3xl p-8 text-white">
                        <h2 className="text-xl font-bold text-center mb-8">
                            Technology Stack
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Google Earth Engine', desc: 'Satellite processing', emoji: '🌍' },
                                { label: 'Sentinel-1 SAR', desc: 'Radar detection', emoji: '📡' },
                                { label: 'Random Forest ML', desc: 'Risk prediction', emoji: '🤖' },
                                { label: 'Django + DRF', desc: 'REST API backend', emoji: '🐍' },
                                { label: 'Next.js 14', desc: 'React frontend', emoji: '⚡' },
                                { label: 'WebSockets', desc: 'Real-time updates', emoji: '🔌' },
                                { label: 'PostgreSQL', desc: 'Production database', emoji: '🗄️' },
                                { label: 'Celery + Redis', desc: 'Automated tasks', emoji: '⏰' },
                            ].map((item, i) => (
                                <div key={i} className="bg-slate-800 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-2">{item.emoji}</div>
                                    <p className="text-sm font-semibold text-white">{item.label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Academic context */}
                <section className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                        Academic Context
                    </h2>
                    <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
                        This system was developed as a final year engineering project.
                        It demonstrates how satellite remote sensing and machine learning
                        can be applied to protect vulnerable communities from natural
                        disasters in the Cameroonian context. All satellite data is
                        freely available through Google Earth Engine.
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <Link href="/"
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl
                         text-sm font-semibold hover:bg-blue-700 transition-colors">
                            Open the System →
                        </Link>
                        <Link href="/forecast"
                            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200
                         rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                            View Forecast
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}

function Stat({ number, label, color }: { number: string; label: string; color: string }) {
    return (
        <div>
            <p className={`text-4xl font-black ${color}`}>{number}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
    );
}

function HowCard({ step, icon, title, desc, bg }: {
    step: string; icon: React.ReactNode;
    title: string; desc: string; bg: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6
                    hover:shadow-md transition-shadow">
            <div className={`inline-flex p-3 rounded-xl ${bg} mb-4`}>{icon}</div>
            <p className="text-xs font-bold text-gray-400 mb-1">STEP {step}</p>
            <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function DataCard({ name, org, desc, tag, icon }: {
    name: string; org: string; desc: string; tag: string; icon: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                    hover:shadow-md transition-shadow">
            <div className="text-2xl mb-3">{icon}</div>
            <h3 className="text-sm font-bold text-gray-900">{name}</h3>
            <p className="text-xs text-blue-600 font-medium mb-2">{org}</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{desc}</p>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5
                       rounded-full border border-green-200 font-medium">
                ✓ {tag}
            </span>
        </div>
    );
}

function FeatureCard({ icon, title, bg, desc }: {
    icon: React.ReactNode; title: string; bg: string; desc: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                    hover:shadow-md transition-shadow flex gap-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center
                       justify-center flex-shrink-0`}>
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}