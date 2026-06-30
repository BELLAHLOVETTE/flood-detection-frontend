'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  const modules = [
    {
      href: '/alerts', title: t('land.mod.alerts.title'), body: t('land.mod.alerts.body'),
      icon: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />,
      extra: <path d="M13.73 21a2 2 0 0 1-3.46 0" />,
    },
    {
      href: '/map', title: t('land.mod.map.title'), body: t('land.mod.map.body'),
      icon: <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />,
      extra: <><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></>,
    },
    {
      href: '/history', title: t('land.mod.history.title'), body: t('land.mod.history.body'),
      icon: <path d="M21 12a9 9 0 1 1-9-9" />,
      extra: <path d="M12 6v6l3 2" />,
    },
  ];

  const howItWorks = [
    ['Sentinel-1 SAR', t('land.how.sar.body')],
    ['CHIRPS rainfall', t('land.how.chirps.body')],
    ['JRC water extent', t('land.how.jrc.body')],
    ['Random Forest ML', t('land.how.ml.body')],
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--fw-paper)' }}>
      <Navbar />

      {/* ── Full-bleed flood image banner (edge to edge) ─── */}
      <div className="relative w-full h-[40vh] min-h-[280px] sm:h-[46vh] overflow-hidden fw-fade">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flood-maga.png"
          alt="Flooding in the Maga region, Far North Cameroon"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,85,96,0.20) 0%, rgba(10,85,96,0.05) 40%, var(--fw-paper) 98%)' }} />
      </div>

      {/* ── Hero content ──────────── */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 -mt-12 pb-24 text-center relative z-10">
          {show && (
            <>
              <div className="flex justify-center mb-6 fw-fade">
                <div className="fw-wave">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-mark.svg" alt="Flood-Watch" width={80} height={80} />
                </div>
              </div>

              <p className="fw-rise fw-d1 text-[12px] tracking-[0.22em] uppercase mb-5"
                style={{ color: 'var(--fw-teal)' }}>
                {t('land.eyebrow')}
              </p>

              <h1 className="fw-rise fw-d2 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]"
                style={{ color: 'var(--fw-deep)' }}>
                {t('land.hero.title1')}
                <br />
                {t('land.hero.title2')}
              </h1>

              <p className="fw-rise fw-d3 mt-6 text-lg max-w-xl mx-auto leading-relaxed"
                style={{ color: 'var(--fw-ink)', opacity: 0.8 }}>
                {t('land.hero.desc')}
              </p>

              <div className="fw-rise fw-d4 mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/dashboard"
                  className="px-7 py-3.5 rounded-full text-white font-medium text-[15px] shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: 'var(--fw-teal)' }}>
                  {t('land.hero.cta.dashboard')}
                </Link>
                <Link href="/forecast"
                  className="px-7 py-3.5 rounded-full font-medium text-[15px] border transition-colors duration-200"
                  style={{ borderColor: 'var(--fw-line)', color: 'var(--fw-deep)' }}>
                  {t('land.hero.cta.forecast')}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Modules ───────────────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ background: 'var(--fw-line)' }}>
          {modules.map((m, i) => (
            <Link key={m.href} href={m.href}
              className={`group block p-8 transition-colors duration-300 fw-rise fw-d${i + 1}`}
              style={{ background: 'var(--fw-paper)' }}>
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl mb-5 transition-colors"
                style={{ background: 'var(--fw-mist)', color: 'var(--fw-teal)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {m.icon}{m.extra}
                </svg>
              </span>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--fw-deep)' }}>
                {m.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--fw-ink)', opacity: 0.72 }}>
                {m.body}
              </p>
              <span className="mt-4 inline-block text-[13px] font-medium opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                style={{ color: 'var(--fw-teal)' }}>
                {t('land.mod.open')}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────── */}
      <section style={{ background: 'var(--fw-deep)' }} className="text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20">
          <p className="text-[12px] tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--fw-aqua)' }}>
            {t('land.how.eyebrow')}
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold max-w-2xl leading-snug">
            {t('land.how.title')}
          </h2>

          <div className="grid sm:grid-cols-4 gap-8 mt-12">
            {howItWorks.map(([h, b], i) => (
              <div key={h}>
                <div className="text-[13px] font-mono mb-2" style={{ color: 'var(--fw-aqua)' }}>
                  0{i + 1}
                </div>
                <h3 className="font-medium mb-1.5">{h}</h3>
                <p className="text-[13.5px] leading-relaxed text-white/65">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--fw-deep)' }}>
          {t('land.cta.title')}
        </h2>
        <p className="mt-3 text-lg max-w-md mx-auto" style={{ color: 'var(--fw-ink)', opacity: 0.75 }}>
          {t('land.cta.desc')}
        </p>
        <Link href="/alerts"
          className="inline-block mt-8 px-8 py-3.5 rounded-full text-white font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          style={{ background: 'var(--fw-teal)' }}>
          {t('land.cta.btn')}
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ background: 'var(--fw-deep)' }} className="text-white/80">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pb-10 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.svg" alt="" width={28} height={28} />
                <span className="text-white font-semibold">Flood-Watch Cameroon</span>
              </div>
              <p className="text-[13.5px] text-white/55 leading-relaxed max-w-xs">
                {t('land.footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 text-[14px]">{t('land.footer.platform')}</h4>
              <ul className="space-y-2 text-[13.5px] text-white/65">
                <li><Link href="/dashboard" className="hover:text-white transition">{t('nav.dashboard')}</Link></li>
                <li><Link href="/forecast" className="hover:text-white transition">{t('land.footer.forecast7')}</Link></li>
                <li><Link href="/map" className="hover:text-white transition">{t('land.footer.floodmap')}</Link></li>
                <li><Link href="/history" className="hover:text-white transition">{t('land.footer.histdata')}</Link></li>
                <li><Link href="/alerts" className="hover:text-white transition">{t('nav.alerts')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 text-[14px]">{t('land.footer.about')}</h4>
              <ul className="space-y-2 text-[13.5px] text-white/65">
                <li><Link href="/about" className="hover:text-white transition">{t('land.footer.howitworks')}</Link></li>
                <li><Link href="/login" className="hover:text-white transition">{t('land.footer.authlogin')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-8 text-[12.5px] text-white/45">
            <div>{t('land.footer.project')}</div>
            <div>Sentinel-1 · CHIRPS · JRC · NOAA GFS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}