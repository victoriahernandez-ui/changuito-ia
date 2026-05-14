'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryInflationChartProps {
  data: Record<string, number>;
}

export default function CategoryInflationChart({ data }: CategoryInflationChartProps) {
  const chartData = Object.entries(data).map(([category, inflation]) => ({
    category: category.length > 10 ? category.substring(0, 10) + '...' : category,
    fullCategory: category,
    inflation: Number(inflation.toFixed(1))
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" aspect={2} minWidth={0}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          <XAxis
            dataKey="category"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Inflación (%)', angle: -90, position: 'insideLeft' }}
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
              typeof value === 'number' ? `${value}%` : 'N/A',
              'Inflación'
            ]}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return `Categoría: ${payload[0].payload.fullCategory}`;
              }
              return label;
            }}
          />
          <Bar
            dataKey="inflation"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}