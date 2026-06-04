// src/app/admin/layout.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [ok, setOk] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace('/login');
        } else {
            setOk(true);
        }
    }, [router]);

    if (!ok) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent
                          rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Vérification des permissions...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}