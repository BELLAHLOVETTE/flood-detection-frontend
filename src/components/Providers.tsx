// src/components/Providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { LanguageProvider } from '@/lib/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 2,  // 2 minutes
                    gcTime: 1000 * 60 * 10, // 10 minutes
                    retry: 2,
                    refetchOnWindowFocus: false,
                },
            },
        })
    );

    return (
        <LanguageProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'var(--color-slate-800)',
                            color: 'var(--color-slate-50)',
                            fontSize: '14px',
                            borderRadius: '12px',
                        },
                        success: { iconTheme: { primary: 'var(--color-green-500)', secondary: 'var(--color-white)' } },
                        error: { iconTheme: { primary: 'var(--color-red-500)', secondary: 'var(--color-white)' } },
                    }}
                />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </LanguageProvider>
    );
}