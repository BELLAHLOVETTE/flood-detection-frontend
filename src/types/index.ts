// src/types/index.ts

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface RiskAssessment {
    id: string | null;
    assessed_at: string | null;
    probability: number;
    risk_level: RiskLevel;
    previous_risk_level: RiskLevel | null;
    model_version: string;
    risk_color: string;
    is_escalation: boolean;
    is_manual_override: boolean;
    message?: string;
}

export interface RainfallReading {
    date: string;
    rainfall_mm: number;
    cumulative_7d: number;
    cumulative_30d: number;
    source: string;
}

export interface WaterLevelReading {
    date: string;
    water_area_km2: number;
    baseline_area_km2: number;
    change_percent: number;
    fill_percentage: number;
    source: string;
}

export interface FloodEvent {
    id: string;
    event_date: string;
    end_date: string | null;
    severity: RiskLevel;
    severity_fr: string;
    affected_area_km2: number;
    affected_population: number;
    description: string;
    source: string;
    is_confirmed: boolean;
    duration_days: number | null;
}

export interface SubscribePayload {
    phone?: string;
    email?: string;
    channel: 'sms' | 'email' | 'both';
    language: 'fr' | 'en';
}

export interface AlertRecord {
    id: string;
    triggered_at: string;
    risk_level: RiskLevel;
    alert_type: string;
    title: string;
    message_fr: string;
    total_recipients: number;
    sms_sent: number;
    email_sent: number;
    is_all_clear: boolean;
    delivery_rate: number;
}

// Risk level display configuration
export const RISK_CONFIG: Record<RiskLevel, {
    label: string;
    labelFr: string;
    color: string;
    bgColor: string;
    textColor: string;
    border: string;
    icon: string;
}> = {
    low: {
        label: 'Low',
        labelFr: 'Faible',
        color: '#22c55e',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        border: 'border-green-400',
        icon: '🟢',
    },
    medium: {
        label: 'Medium',
        labelFr: 'Modéré',
        color: '#eab308',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        border: 'border-yellow-400',
        icon: '🟡',
    },
    high: {
        label: 'High',
        labelFr: 'Élevé',
        color: '#f97316',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        border: 'border-orange-400',
        icon: '🟠',
    },
    critical: {
        label: 'Critical',
        labelFr: 'Critique',
        color: '#ef4444',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        border: 'border-red-500',
        icon: '🔴',
    },
};