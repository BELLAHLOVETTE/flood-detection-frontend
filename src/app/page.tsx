// src/app/page.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import type { RiskAssessment } from '@/types';
import RiskBadge from '@/components/RiskBadge';
import RainfallChart from '@/components/RainfallChart';
import WaterGauge from '@/components/WaterGauge';
import { LiveRiskBanner } from '@/components/LiveRiskBanner'
import { LoadingKPI, LoadingCard } from '@/components/LoadingCard';
import {
  getCurrentRisk, getRainfallSeries,
  getWaterLevel, getSubscriberCount,
} from '@/lib/api';
import { formatNumber, timeAgo } from '@/lib/utils';
import {
  AlertTriangle, CloudRain, Droplets,
  Users, Info, TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: risk, isLoading: riskLoading } = useQuery({
    queryKey: ['risk-current'],
    queryFn: getCurrentRisk,
    refetchInterval: 30_000, // poll every 30s
  });

  const { data: rainfall = [], isLoading: rainLoading } = useQuery({
    queryKey: ['rainfall', 90],
    queryFn: () => getRainfallSeries(90),
    refetchInterval: 60_000,
  });

  const { data: waterLevels = [], isLoading: waterLoading } = useQuery({
    queryKey: ['water-level'],
    queryFn: () => getWaterLevel(90),
    refetchInterval: 60_000,
  });

  const { data: subscribers } = useQuery({
    queryKey: ['subscriber-count'],
    queryFn: getSubscriberCount,
    refetchInterval: 120_000,
  });

  const latestWater = waterLevels[0] || null;
  const latestRain = rainfall[0] || null;
  const currentRisk: RiskAssessment = risk || {
    id: null,
    probability: 0,
    risk_level: 'low',
    previous_risk_level: null,
    assessed_at: null,
    model_version: 'none',
    risk_color: '#22c55e',
    is_escalation: false,
    is_manual_override: false,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Live Risk Banner — real-time WebSocket updates */}
      <LiveRiskBanner initial={currentRisk} />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center
                          justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord — Maga, Extrême-Nord
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {currentRisk.assessed_at
                  ? `Mis à jour ${timeAgo(currentRisk.assessed_at)}`
                  : 'En attente des données satellite...'}
                {currentRisk.model_version !== 'none' && (
                  <span className="ml-2 text-blue-500">
                    · Modèle: {currentRisk.model_version}
                  </span>
                )}
              </p>
            </div>
            {riskLoading
              ? <div className="h-12 w-40 bg-gray-100 rounded-xl animate-pulse" />
              : <RiskBadge
                level={currentRisk.risk_level}
                probability={currentRisk.probability}
                size="lg"
              />
            }
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {riskLoading ? (
            [...Array(4)].map((_, i) => <LoadingKPI key={i} />)
          ) : (
            <>
              <KPICard
                icon={<AlertTriangle className="w-5 h-5 text-orange-500" />}
                label="Probabilité inondation"
                value={`${(currentRisk.probability * 100).toFixed(0)}%`}
                subtext={`Niveau ${currentRisk.risk_level}`}
                bg="bg-orange-50"
                trend={currentRisk.is_escalation ? 'up' : null}
              />
              <KPICard
                icon={<CloudRain className="w-5 h-5 text-blue-500" />}
                label="Pluie (dernier relevé)"
                value={latestRain ? `${latestRain.rainfall_mm.toFixed(1)} mm` : '—'}
                subtext={latestRain
                  ? `7j: ${latestRain.cumulative_7d.toFixed(0)} mm`
                  : 'Aucune donnée'}
                bg="bg-blue-50"
              />
              <KPICard
                icon={<Droplets className="w-5 h-5 text-teal-500" />}
                label="Lac Maga"
                value={latestWater
                  ? `${latestWater.water_area_km2.toFixed(0)} km²`
                  : '—'}
                subtext={latestWater
                  ? `${latestWater.change_percent > 0 ? '+' : ''}${latestWater.change_percent.toFixed(1)}% vs normale`
                  : 'Aucune donnée'}
                bg="bg-teal-50"
              />
              <KPICard
                icon={<Users className="w-5 h-5 text-purple-500" />}
                label="Abonnés aux alertes"
                value={formatNumber(subscribers?.count ?? 0)}
                subtext="Abonnés vérifiés actifs"
                bg="bg-purple-50"
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6
                          hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Précipitations — 90 derniers jours
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100
                               px-2.5 py-1 rounded-full font-medium">
                CHIRPS
              </span>
            </div>
            {rainLoading
              ? <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
              : <RainfallChart data={rainfall} />
            }
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6
                          hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Niveau du Lac Maga
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100
                               px-2.5 py-1 rounded-full font-medium">
                JRC
              </span>
            </div>
            {waterLoading
              ? <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
              : <WaterGauge data={latestWater} />
            }
          </div>

        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-slate-50
                        border border-blue-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center
                            justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                À propos du système Flood-Watch
              </p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                Ce système utilise des images radar Sentinel-1 SAR via Google
                Earth Engine et des données de précipitations CHIRPS pour prédire
                les risques d&apos;inondation dans la région de Maga (Extrême-Nord
                Cameroun). Les données sont actualisées toutes les 6 heures par
                des tâches automatisées. Modèle ML actif:&nbsp;
                <span className="font-medium text-blue-700">
                  {currentRisk.model_version}
                </span>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({
  icon, label, value, subtext, bg, trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  bg: string;
  trend?: 'up' | 'down' | null;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                    hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                    cursor-default">
      <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend === 'up' && (
          <div className="flex items-center gap-0.5 text-orange-500 mb-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Hausse</span>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1">{subtext}</p>
    </div>
  );
}