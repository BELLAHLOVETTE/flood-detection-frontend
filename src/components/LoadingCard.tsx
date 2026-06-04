// src/components/LoadingCard.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingCard({ rows = 3 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} className={`h-4 w-${i === rows - 1 ? '2/3' : 'full'}`} />
            ))}
        </div>
    );
}

export function LoadingKPI() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-3 w-full" />
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <LoadingKPI key={i} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LoadingCard rows={5} />
                <LoadingCard rows={5} />
            </div>
        </div>
    );
}