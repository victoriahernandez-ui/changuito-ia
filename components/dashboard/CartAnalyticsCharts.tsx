'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Store, Calendar, ShoppingCart } from 'lucide-react';
import { CartAnalytics } from '@/data/cartAnalytics';

interface CartAnalyticsChartsProps {
  analytics: CartAnalytics;
}

export default function CartAnalyticsCharts({ analytics }: CartAnalyticsChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Most expensive products chart data
  const expensiveProductsData = analytics.mostExpensiveProducts.map(item => ({
    name: item.product.name.length > 15 ? item.product.name.substring(0, 15) + '...' : item.product.name,
    fullName: item.product.name,
    savings: item.savings,
    price: item.totalPrice
  }));

  // Cheapest supermarkets chart data
  const supermarketData = analytics.cheapestSupermarkets.map(item => ({
    name: item.store,
    price: item.totalPrice,
    savings: item.savings,
    percentage: Number(item.percentage.toFixed(1))
  }));

  // Monthly spending simulation chart data
  const spendingData = analytics.monthlySpendingSimulation.map(item => ({
    month: new Date(item.month + '-01').toLocaleDateString('es-AR', {
      month: 'short',
      year: '2-digit'
    }),
    cost: item.estimatedCost,
    fullMonth: item.month
  }));

  if (!isMounted) {
    return <div className="space-y-12" />;
  }

  // Show message if no cart data
  if (analytics.mostExpensiveProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-slate-400" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No hay productos en el carrito</h3>
        <p className="text-slate-500">Agrega productos a tu carrito para ver el análisis personalizado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Cart Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-red-100/80">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Inflación del Carrito</p>
            <p className="text-3xl font-bold text-slate-900">{analytics.averageCartInflation.toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-100/80">
              <Store className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Supermercado Más Barato</p>
            <p className="text-lg font-bold text-slate-900">
              {analytics.cheapestSupermarkets[0]?.store || 'N/A'}
            </p>
            <p className="text-sm text-green-600">
              ${analytics.cheapestSupermarkets[0]?.totalPrice.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-100/80">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Ahorro Máximo</p>
            <p className="text-3xl font-bold text-slate-900">
              ${analytics.cheapestSupermarkets[0]?.savings.toLocaleString() || 0}
            </p>
            <p className="text-sm text-blue-600">
              {analytics.cheapestSupermarkets[0]?.percentage.toFixed(1) || 0}% menos
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Expensive Products */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-red-600" />
            <h3 className="text-2xl font-bold text-slate-900">Productos Más Caros</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" aspect={2} minWidth={0}>
              <BarChart data={expensiveProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="name"
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
                  label={{ value: 'Ahorro ($)', angle: -90, position: 'insideLeft' }}
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
                  formatter={(value: any) => [
                    `$${value}`,
                    'Ahorro'
                  ]}
                  labelFormatter={(label, payload: unknown) => {
                    if (payload && Array.isArray(payload) && payload.length > 0 && typeof payload[0] === 'object' && payload[0] !== null && 'payload' in payload[0]) {
                      return `Producto: ${(payload[0].payload as { fullName: string }).fullName}`;
                    }
                    return label;
                  }}
                />
                <Bar
                  dataKey="savings"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cheapest Supermarkets */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-green-600" />
            <h3 className="text-2xl font-bold text-slate-900">Supermercados Más Baratos</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" aspect={2} minWidth={0}>
              <BarChart data={supermarketData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="name"
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
                  label={{ value: 'Total ($)', angle: -90, position: 'insideLeft' }}
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
                  formatter={(value: any) => [
                    `$${value}`,
                    'Total'
                  ]}
                  labelFormatter={(label) => `Supermercado: ${label}`}
                />
                <Bar
                  dataKey="price"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Spending Simulation */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-slate-900">Simulación de Gastos Mensuales</h3>
        </div>
        <p className="text-slate-600 mb-6">
          Proyección del costo de tu carrito actual con la inflación promedio del {analytics.averageCartInflation.toFixed(1)}% mensual
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" aspect={2} minWidth={0}>
            <LineChart data={spendingData}>
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
                label={{ value: 'Costo Estimado ($)', angle: -90, position: 'insideLeft' }}
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
                formatter={(value) => [
  `$${Number(value).toLocaleString('es-AR')}`,
  'Costo Estimado'
]}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}