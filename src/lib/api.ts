// src/lib/api.ts
import axios, { AxiosError } from 'axios';
import type {
    RiskAssessment, RainfallReading, WaterLevelReading,
    FloodEvent, SubscribePayload, AlertRecord,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        // Import dynamically to avoid circular imports
        const { getAccessToken } = require('./auth');
        const token = getAccessToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const original = error.config as typeof error.config & { _retry?: boolean };
        if (error.response?.status === 401 && !original?._retry) {
            original._retry = true;
            const { refreshAccessToken } = await import('./auth');
            const newToken = await refreshAccessToken();
            if (newToken && original) {
                original.headers = original.headers || {};
                original.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(original);
            }
            // Refresh failed — redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ── API FUNCTIONS ─────────────────────────────────────────────────────────────

export const getCurrentRisk = () =>
    apiClient.get<RiskAssessment>('/risk/current/').then(r => r.data);

export const getRiskHistory = (days = 30) =>
    apiClient.get<RiskAssessment[]>(`/risk/history/?days=${days}`).then(r => r.data);

export const getRainfallSeries = (days = 90) =>
    apiClient.get<RainfallReading[]>(`/rainfall/?days=${days}`).then(r => r.data);

export const getWaterLevel = (days = 90) =>
    apiClient.get<WaterLevelReading[]>(`/water-level/?days=${days}`).then(r => r.data);

export const getFloodEvents = (params?: { year?: number; severity?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.year) qs.set('year', String(params.year));
    if (params?.severity) qs.set('severity', params.severity);
    return apiClient.get<FloodEvent[]>(`/flood-events/?${qs}`).then(r => r.data);
};

export const getFloodExtent = () =>
    apiClient.get('/map/flood-extent/').then(r => r.data);

export const getSubscriberCount = () =>
    apiClient.get<{ count: number }>('/alerts/count/').then(r => r.data);

export const getAlertHistory = () =>
    apiClient.get<AlertRecord[]>('/alerts/history/').then(r => r.data);

export const subscribeToAlerts = (payload: SubscribePayload) =>
    apiClient.post('/alerts/subscribe/', payload).then(r => r.data);

export const verifyOTP = (sub_id: string, otp: string) =>
    apiClient.post('/alerts/verify/', { sub_id, otp }).then(r => r.data);

export const getSystemHealth = () =>
    apiClient.get('/admin/health/').then(r => r.data);