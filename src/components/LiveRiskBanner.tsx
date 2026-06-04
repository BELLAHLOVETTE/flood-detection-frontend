// src/components/LiveRiskBanner.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { RISK_CONFIG, type RiskAssessment, type RiskLevel } from '@/types';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/LanguageContext';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8000/ws/risk/';

interface Props { initial: RiskAssessment; }

export function LiveRiskBanner({ initial }: Props) {
    const { t } = useLanguage();
    const [risk, setRisk] = useState(initial);
    const [connected, setConnected] = useState(false);
    const [justUpdated, setJustUpdated] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        function connect() {
            try {
                const ws = new WebSocket(WS_URL);
                wsRef.current = ws;

                ws.onopen = () => setConnected(true);
                ws.onclose = () => {
                    setConnected(false);
                    timer = setTimeout(connect, 5000); // reconnect
                };
                ws.onerror = () => ws.close();

                ws.onmessage = (e) => {
                    try {
                        const msg = JSON.parse(e.data);
                        if (msg.type === 'risk_update') {
                            setRisk(prev => ({ ...prev, ...msg }));
                            setJustUpdated(true);
                            setTimeout(() => setJustUpdated(false), 2000);
                        }
                    } catch { /* ignore parse errors */ }
                };
            } catch { /* ws not available in SSR */ }
        }

        connect();
        return () => {
            clearTimeout(timer);
            wsRef.current?.close();
        };
    }, []);

    const config = RISK_CONFIG[risk.risk_level as RiskLevel] || RISK_CONFIG.low;

    // Only show banner for medium risk or higher
    if (risk.risk_level === 'low' && !connected) return null;

    return (
        <div
            className={cn(
                'border-b transition-all duration-500',
                risk.risk_level === 'critical' && 'bg-red-600 border-red-700',
                risk.risk_level === 'high' && 'bg-orange-500 border-orange-600',
                risk.risk_level === 'medium' && 'bg-yellow-50 border-yellow-200',
                risk.risk_level === 'low' && 'bg-green-50 border-green-200',
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2">
                        {(risk.risk_level === 'critical' || risk.risk_level === 'high') && (
                            <AlertTriangle className={cn(
                                'w-4 h-4 flex-shrink-0',
                                risk.risk_level === 'critical' ? 'text-white' : 'text-white'
                            )} />
                        )}
                        <p className={cn(
                            'text-sm font-medium',
                            risk.risk_level === 'critical' && 'text-white',
                            risk.risk_level === 'high' && 'text-white',
                            risk.risk_level === 'medium' && 'text-yellow-800',
                            risk.risk_level === 'low' && 'text-green-700',
                        )}>
                            {risk.risk_level === 'critical' && t('banner.critical')}
                            {risk.risk_level === 'high' && t('banner.high')}
                            {risk.risk_level === 'medium' && t('banner.medium')}
                            {risk.risk_level === 'low' && t('banner.low')}
                        </p>
                    </div>

                    {/* Connection status */}
                    <div className={cn(
                        'flex items-center gap-1.5 text-xs flex-shrink-0',
                        risk.risk_level === 'critical' || risk.risk_level === 'high'
                            ? 'text-white/70'
                            : 'text-gray-400'
                    )}>
                        {connected
                            ? <><Wifi className="w-3 h-3" /> {t('banner.live')}</>
                            : <><WifiOff className="w-3 h-3" /> {t('banner.offline')}</>
                        }
                        {justUpdated && (
                            <span className="ml-1 text-green-400 font-medium">• {t('banner.updated')}</span>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}