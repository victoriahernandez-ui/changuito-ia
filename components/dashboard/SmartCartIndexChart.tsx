'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SmartCartIndexData {
  month: string;
  index: number;
  date: Date;
}

interface SmartCartIndexChartProps {
  data: SmartCartIndexData[];
}

export default function SmartCartIndexChart({ data }: SmartCartIndexChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = data.map(item => ({
    month: new Date(item.month + '-01').toLocaleDateString('es-AR', {
      month: 'short',
      year: '2-digit'
    }),
    index: Math.round(item.index),
    fullMonth: item.month
  }));

  if (!isMounted) {
    return <div className="h-80" />;
  }

  return (
    <div className="w-full h-[300px]">
  <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="indexGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Índice Changuito IA ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
            formatter={(value, name) => [
              typeof value === 'number' ? `$${value}` : 'N/A',
              'Índice Changuito IA'
            ]}
            labelFormatter={(label) => `Mes: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="index"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#indexGradient)"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}