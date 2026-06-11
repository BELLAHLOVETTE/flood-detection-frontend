// src/lib/auth.ts
import Cookies from 'js-cookie';
import { apiClient } from './api';

const ACCESS_TOKEN_KEY = 'fw_access';
const REFRESH_TOKEN_KEY = 'fw_refresh';

export function getAccessToken(): string | null {
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
}

export function setTokens(access: string, refresh: string): void {
    // Access token: 1 hour, Refresh token: 7 days
    Cookies.set(ACCESS_TOKEN_KEY, access, { expires: 1 / 24, secure: false, sameSite: 'lax' });
    Cookies.set(REFRESH_TOKEN_KEY, refresh, { expires: 7, secure: false, sameSite: 'lax' });
}

export function clearTokens(): void {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getAccessToken();
}

export async function refreshAccessToken(): Promise<string | null> {
    const refresh = Cookies.get(REFRESH_TOKEN_KEY);
    if (!refresh) return null;

    try {
        const { data } = await apiClient.post('/auth/token/refresh/', { refresh });
        Cookies.set(ACCESS_TOKEN_KEY, data.access, { expires: 1 / 24 });
        return data.access;
    } catch {
        clearTokens();
        return null;
    }
}

// export async function login(
//     username: string,
//     password: string
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const { data } = await apiClient.post('/auth/token/', { username, password });
//         setTokens(data.access, data.refresh);
//         return { success: true };
//     } catch (err: unknown) {
//         const axiosErr = err as { response?: { data?: { detail?: string } } };
//         return {
//             success: false,
//             error: axiosErr?.response?.data?.detail ||
//                 'Identifiants incorrects. Veuillez réessayer.',
//         };
//     }
// }


export async function signup({ full_name, username, email, password }: { full_name: string, username: string, email: string, password: string }) {
    // In a real application, this function would typically make an API call
    // to your backend to handle user registration.
    console.log('Attempting to sign up:', { full_name, username, email, password });

    // Simulate an asynchronous operation, like an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demonstration, we'll simulate a successful signup.
    // In a real scenario, you would return success: false and an error message
    // if the backend call failed (e.g., email already exists, invalid data).
    return { success: true };

    // Example of returning an error:
    // return { success: false, error: 'This is a simulated error message.' };
}

export async function login({ email, password }: { email: string, password: string }) {
    // This is a placeholder for your login logic.
    console.log('Attempting to log in:', { email, password });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}

export async function logout(): Promise<void> {
    clearTokens();
}


