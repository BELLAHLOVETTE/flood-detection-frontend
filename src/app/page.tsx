// src/app/page.tsx
// Server Component — data is fetched on the server for fast initial load

import { Suspense } from 'react';
import { getCurrentRisk, getRainfallSeries, getWaterLevel, getSubscriberCount } from '@/lib/api';
import Navbar from '@/components/Navbar';
import RiskBadge from '@/components/RiskBadge';
import RainfallChart from '@/components/RainfallChart';
import WaterGauge from '@/components/WaterGauge';
import { formatDate, timeAgo, formatNumber } from '@/lib/utils';
import { Droplets, CloudRain, Users, AlertTriangle } from 'lucide-react';

// Re-fetch data every 30 seconds
export const revalidate = 30;

export default async function DashboardPage() {
  // Fetch all data in parallel on the server
  const [risk, rainfall, waterLevels, subscribers] = await Promise.all([
    getCurrentRisk().catch(() => null),
    getRainfallSeries(90).catch(() => []),
    getWaterLevel(90).catch(() => []),
    getSubscriberCount().catch(() => ({ count: 0 })),
  ]);

  const latestWater = waterLevels[0] || null;
  const latestRain = rainfall[0] || null;
  const currentRisk = risk || {
    probability: 0,
    risk_level: 'low' as const,
    assessed_at: null,
    model_version: 'none',
    risk_color: '#22c55e',
    is_escalation: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Risk Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord — Maga, Extrême-Nord
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {currentRisk.assessed_at
                  ? `Dernière mise à jour: ${timeAgo(currentRisk.assessed_at)}`
                  : 'En attente des données satellite...'}
              </p>
            </div>
            <RiskBadge
              level={currentRisk.risk_level}
              probability={currentRisk.probability}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
            label="Probabilité inondation"
            value={`${(currentRisk.probability * 100).toFixed(0)}%`}
            subtext={`Niveau: ${currentRisk.risk_level}`}
            bgColor="bg-orange-50"
          />
          <KPICard
            icon={<CloudRain className="w-5 h-5 text-blue-500" />}
            label="Pluie aujourd'hui"
            value={latestRain ? `${latestRain.rainfall_mm.toFixed(1)} mm` : '-- mm'}
            subtext={latestRain ? `7j: ${latestRain.cumulative_7d.toFixed(0)} mm` : 'Aucune donnée'}
            bgColor="bg-blue-50"
          />
          <KPICard
            icon={<Droplets className="w-5 h-5 text-teal-500" />}
            label="Lac Maga"
            value={latestWater ? `${latestWater.water_area_km2.toFixed(0)} km²` : '-- km²'}
            subtext={latestWater
              ? `${latestWater.change_percent > 0 ? '+' : ''}${latestWater.change_percent.toFixed(1)}% vs normale`
              : 'Aucune donnée'}
            bgColor="bg-teal-50"
          />
          <KPICard
            icon={<Users className="w-5 h-5 text-purple-500" />}
            label="Abonnés alertes"
            value={formatNumber(subscribers.count)}
            subtext="Abonnés actifs vérifiés"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Rainfall Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Précipitations — 90 derniers jours
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                CHIRPS
              </span>
            </div>
            <RainfallChart data={rainfall} />
          </div>

          {/* Water Level Gauge */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Niveau du Lac Maga
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                JRC
              </span>
            </div>
            <WaterGauge data={latestWater} />
          </div>

        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                À propos de ce système
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Ce système utilise des images satellite Sentinel-1 SAR et des données
                de précipitations CHIRPS pour prédire les risques d&apos;inondation dans
                la région de Maga. Les données sont actualisées toutes les 6 heures.
                Modèle ML: {currentRisk.model_version}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── KPI Card Sub-component ────────────────────────────────────────────────────
function KPICard({
  icon,
  label,
  value,
  subtext,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className={`inline-flex p-2 rounded-lg ${bgColor} mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-1">
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {subtext}
      </p>
    </div>
  );
}