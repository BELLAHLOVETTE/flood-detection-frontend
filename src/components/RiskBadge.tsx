// src/components/RiskBadge.tsx
import { cn } from '@/lib/utils';
import { RISK_CONFIG, type RiskLevel } from '@/types';

interface Props {
    level: RiskLevel;
    probability: number;
    size?: 'sm' | 'md' | 'lg';
    showPercent?: boolean;
}

export default function RiskBadge({
    level,
    probability,
    size = 'md',
    showPercent = true,
}: Props) {
    const config = RISK_CONFIG[level];

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-xl font-semibold border-2',
                config.bgColor,
                config.textColor,
                config.border,
                sizeClasses[size]
            )}
        >
            <span className="text-lg">{config.icon}</span>
            <div>
                <span className="font-bold">{config.labelFr}</span>
                {showPercent && (
                    <span className="ml-1 opacity-75 font-normal">
                        ({(probability * 100).toFixed(0)}%)
                    </span>
                )}
            </div>
        </div>
    );
}