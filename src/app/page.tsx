// src/app/page.tsx - Replace with this landing page component
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration flash by only showing animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Variants optimized for fast re-entry
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/30 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={mounted ? "hidden" : "visible"}
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-blue-700 tracking-wide">
                {t('landing.hero.badge')}
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl">
              {t('landing.hero.title1')} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                {t('landing.hero.title2')}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-gray-600 max-w-2xl mt-6 leading-relaxed">
              {t('landing.hero.desc')}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                {t('landing.hero.cta.start')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link href="/dashboard" className="bg-white border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 font-medium px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2">
                {t('landing.hero.cta.demo')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" /> {t('landing.hero.stat.sat')}</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full" /> {t('landing.hero.stat.updates')}</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-amber-500 rounded-full" /> {t('landing.hero.stat.verified')}</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section - Cards with Links */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('landing.why.title')}</h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mt-4" />
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">{t('landing.why.desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Links to Alerts page */}
            <Link href="/alerts" className="group block bg-white rounded-2xl border border-gray-100 shadow-sm p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-orange-500"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /><circle cx="12" cy="12" r="2" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">Instant Alerts</h3>
              <p className="text-gray-500 leading-relaxed">Receive real-time flood alerts directly to your device before it's too late.</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold gap-1 opacity-0 group-hover:opacity-100 transition">Learn more →</div>
            </Link>

            {/* Card 2 - Links to Map page */}
            <Link href="/map" className="group block bg-white rounded-2xl border border-gray-100 shadow-sm p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-green-600"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">Interactive Maps</h3>
              <p className="text-gray-500 leading-relaxed">See flood-prone areas and water levels on live interactive maps of Cameroon.</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold gap-1 opacity-0 group-hover:opacity-100 transition">Explore map →</div>
            </Link>

            {/* Card 3 - Links to History page */}
            <Link href="/history" className="group block bg-white rounded-2xl border border-gray-100 shadow-sm p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-purple-600"><path d="M21 12a9 9 0 1 1-9-9" /><path d="M12 6v6l3 2" /><path d="M12 3v3" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">Data Analytics</h3>
              <p className="text-gray-500 leading-relaxed">Track rainfall trends, water levels, and risk patterns over time.</p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold gap-1 opacity-0 group-hover:opacity-100 transition">View insights →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Risk Preview */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-1.5 border border-blue-400/40">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold tracking-wider">LIVE RISK METRIC</span>
              </div>
              <h2 className="text-3xl font-bold">Current Flood Risk Assessment</h2>
              <p className="text-slate-300 text-lg leading-relaxed">Lake Nyos & Coastal regions – Moderate to low alert level. Water levels monitored by satellite altimetry.</p>
              <div className="flex gap-3 pt-2">
                <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-cyan-300">87%</div>
                  <div className="text-xs text-slate-300">Detection accuracy</div>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-orange-300">4.2k+</div>
                  <div className="text-xs text-slate-300">Active subscribers</div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl w-full max-w-sm animate-[float_4s_ease-in-out_infinite]">
                <div className="flex justify-between text-sm text-slate-300 mb-3">
                  <span>⚠️ Yaoundé Basin</span>
                  <span className="text-amber-300 font-bold">Risk: Moderate</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-[48%] h-full bg-amber-500 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5 text-xs">
                  <div><span className="text-slate-400">Rainfall (24h)</span><br /><span className="font-mono text-white">23.4 mm</span></div>
                  <div><span className="text-slate-400">Water area</span><br /><span className="font-mono text-white">142 km²</span></div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-blue-300">Last update: 2 min ago · Sentinel-1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 md:p-14 shadow-md border border-blue-100">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Ready to Stay Safe?</h2>
            <p className="text-gray-600 text-lg mt-3 max-w-lg mx-auto">Join thousands of users protecting their communities from floods.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="bg-blue-700 hover:bg-blue-800 text-white text-base font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2">
                Create Your Account Today
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg>
                </div>
                <span className="text-white font-bold text-lg">Flood-Watch Cameroon</span>
              </div>
              <p className="text-sm text-slate-400">
                Satellite-based flood detection and early warning for Maga
                Sub-Division, Far North Cameroon.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link></li>
                <li><Link href="/forecast" className="hover:text-blue-400 transition">7-Day Forecast</Link></li>
                <li><Link href="/map" className="hover:text-blue-400 transition">Flood Map</Link></li>
                <li><Link href="/history" className="hover:text-blue-400 transition">Historical Data</Link></li>
                <li><Link href="/alerts" className="hover:text-blue-400 transition">Alert System</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">About</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition">How It Works</Link></li>
                <li><Link href="/about" className="hover:text-blue-400 transition">Data Sources</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition">Authority Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-sm text-slate-500">
            <div>© 2026 Flood-Watch Cameroon. Final year project — Maga, Far North.</div>
            <div className="text-xs">
              Data: Sentinel-1 SAR · CHIRPS · JRC · NOAA GFS
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}