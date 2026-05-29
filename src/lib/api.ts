// src/lib/api.ts
import axios from 'axios';
import type {
    RiskAssessment,
    RainfallReading,
    WaterLevelReading,
    FloodEvent,
    SubscribePayload,
    AlertRecord,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token for authenticated requests
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ── API FUNCTIONS ─────────────────────────────────────────────────────────────

export async function getCurrentRisk(): Promise<RiskAssessment> {
    const { data } = await apiClient.get<RiskAssessment>('/risk/current/');
    return data;
}

export async function getRiskHistory(days = 30): Promise<RiskAssessment[]> {
    const { data } = await apiClient.get<RiskAssessment[]>(`/risk/history/?days=${days}`);
    return data;
}

export async function getRainfallSeries(days = 90): Promise<RainfallReading[]> {
    const { data } = await apiClient.get<RainfallReading[]>(`/rainfall/?days=${days}`);
    return data;
}

export async function getWaterLevel(days = 90): Promise<WaterLevelReading[]> {
    const { data } = await apiClient.get<WaterLevelReading[]>(`/water-level/?days=${days}`);
    return data;
}

export async function getFloodEvents(year?: number): Promise<FloodEvent[]> {
    const params = year ? `?year=${year}` : '';
    const { data } = await apiClient.get<FloodEvent[]>(`/flood-events/${params}`);
    return data;
}

export async function getFloodExtent(): Promise<GeoJSON.FeatureCollection> {
    const { data } = await apiClient.get('/map/flood-extent/');
    return data;
}

export async function getSubscriberCount(): Promise<{ count: number }> {
    const { data } = await apiClient.get('/alerts/count/');
    return data;
}

export async function getAlertHistory(): Promise<AlertRecord[]> {
    const { data } = await apiClient.get<AlertRecord[]>('/alerts/history/');
    return data;
}

export async function subscribeToAlerts(
    payload: SubscribePayload
): Promise<{ message: string; sub_id: string; is_new: boolean }> {
    const { data } = await apiClient.post('/alerts/subscribe/', payload);
    return data;
}

export async function verifyOTP(
    sub_id: string,
    otp: string
): Promise<{ verified: boolean; message?: string; error?: string }> {
    const { data } = await apiClient.post('/alerts/verify/', { sub_id, otp });
    return data;
}