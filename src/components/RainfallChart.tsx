// src/components/RainfallChart.tsx
'use client';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { RainfallReading } from '@/types';

interface Props {
    data: RainfallReading[];
}

export default function RainfallChart({ data }: Props) {
    // Reverse so oldest date is on left, newest on right
    const chartData = [...data].reverse().map((r) => ({
        date: format(parseISO(r.date), 'd MMM', { locale: fr }),
        'Pluie': parseFloat(r.rainfall_mm.toFixed(1)),
        '7j cumul': parseFloat(r.cumulative_7d.toFixed(1)),
    }));

    return (
        <ResponsiveContainer width="100%" height={250}>
            <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    interval={13}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    formatter={(value: any, name: any) => [
                        `${Number(value).toFixed(1)} mm`,
                        name,
                    ]}
                    contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '12px',
                    }}
                />
                <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
                {/* Reference line at 80mm — medium risk threshold */}
                <ReferenceLine
                    y={80}
                    stroke="#f97316"
                    strokeDasharray="4 4"
                    label={{
                        value: 'Seuil 80mm',
                        position: 'right',
                        fontSize: 10,
                        fill: '#f97316',
                    }}
                />
                <Bar
                    dataKey="Pluie"
                    fill="#2E75B6"
                    opacity={0.8}
                    radius={[2, 2, 0, 0]}
                />
                <Line
                    type="monotone"
                    dataKey="7j cumul"
                    stroke="#1ABC9C"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}