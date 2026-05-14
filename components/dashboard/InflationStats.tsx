'use client';

import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { InflationData } from '@/data/inflationData';

interface InflationStatsProps {
  latestData?: InflationData;
  inflationChange: number;
}

export default function InflationStats({ latestData, inflationChange }: InflationStatsProps) {
  if (!latestData) return null;

  const stats = [
    {
      label: 'Inflación Actual',
      value: `${latestData.inflation.toFixed(1)}%`,
      change: inflationChange,
      icon: <Activity className="w-6 h-6" />,
      color: 'blue'
    },
    {
      label: 'Categorías Analizadas',
      value: Object.keys(latestData.categoryInflation).length.toString(),
      change: null,
      icon: <Target className="w-6 h-6" />,
      color: 'green'
    },
    {
      label: 'Productos Monitoreados',
      value: latestData.topIncreases.length.toString(),
      change: null,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${stat.color}-100/80`}>
              <div className={`text-${stat.color}-600`}>
                {stat.icon}
              </div>
            </div>
            {stat.change !== null && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                stat.change >= 0
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {stat.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(stat.change).toFixed(1)}%
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}