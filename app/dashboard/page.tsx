'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, BarChart3, PieChart, Activity, Calendar, ShoppingCart, ArrowLeft } from 'lucide-react';
import Navbar from "@/components/Navbar";
import { inflationData, smartCartIndex } from '@/data/inflationData';
import { products } from '@/data/products';
import { calculateCartAnalytics, loadCartFromStorage, CartAnalytics } from '@/data/cartAnalytics';
import InflationChart from '@/components/dashboard/InflationChart';
import CategoryInflationChart from '@/components/dashboard/CategoryInflationChart';
import TopIncreasesList from '@/components/dashboard/TopIncreasesList';
import SmartCartIndexChart from '@/components/dashboard/SmartCartIndexChart';
import InflationStats from '@/components/dashboard/InflationStats';
import CartAnalyticsCharts from '@/components/dashboard/CartAnalyticsCharts';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'3M' | '6M' | '12M'>('12M');
  const [cartItems, setCartItems] = useState<number[]>(() => loadCartFromStorage());

  const cartAnalytics = useMemo(() => {
    const cartProducts = products.filter((product) => cartItems.includes(product.id));
    return calculateCartAnalytics(cartProducts);
  }, [cartItems]);

  // Listen for cart changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smartcart-items') {
        const savedCart = loadCartFromStorage();
        setCartItems(savedCart);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getFilteredData = () => {
    const months = selectedPeriod === '3M' ? 3 : selectedPeriod === '6M' ? 6 : 12;
    return inflationData.slice(-months);
  };

  const filteredData = getFilteredData();
  const latestData = filteredData[filteredData.length - 1];
  const previousData = filteredData[filteredData.length - 2];

  const inflationChange = latestData && previousData
    ? latestData.inflation - previousData.inflation
    : 0;

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 min-h-screen">
        {/* Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/40 shadow-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Panel de Analíticas</span>
              </div>

              <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
                Inflación en Argentina
              </h1>

              <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto">
                Análisis detallado de la evolución de precios en productos esenciales.
                Datos actualizados mensualmente con el índice Changuito IA.
              </p>

              {/* Period Selector */}
              <div className="flex flex-col gap-4 items-center justify-between md:flex-row md:items-center mt-8">
                <div className="flex gap-2">
                  {[
                    { key: '3M', label: '3 Meses' },
                    { key: '6M', label: '6 Meses' },
                    { key: '12M', label: '12 Meses' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPeriod(key as any)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        selectedPeriod === key
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-white/60 backdrop-blur-xl text-slate-700 hover:bg-white/80 border border-white/40'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al comparador
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <InflationStats
              latestData={latestData}
              inflationChange={inflationChange}
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Inflación Mensual</h3>
                </div>
                <InflationChart data={filteredData} />
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-green-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Índice Changuito IA</h3>
                </div>
                <SmartCartIndexChart data={smartCartIndex.slice(-filteredData.length)} />
              </div>
            </div>

            {/* Category and Top Increases */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
                <div className="flex items-center gap-3 mb-6">
                  <PieChart className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Inflación por Categoría</h3>
                </div>
                <CategoryInflationChart data={latestData?.categoryInflation || {}} />
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Productos con Mayor Aumento</h3>
                </div>
                <TopIncreasesList products={latestData?.topIncreases || []} />
              </div>
            </div>
          </div>
        </section>

        {/* Cart Analytics Section */}
        {cartAnalytics && cartItems.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6 mb-12">
                <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/40 shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">Analíticas del Changuito</span>
                </div>

                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
                  Análisis de tu Carrito
                </h2>

                <p className="text-lg text-slate-600 font-light max-w-3xl mx-auto">
                  Insights personalizados basados en los productos de tu carrito de compras.
                </p>
              </div>

              <CartAnalyticsCharts analytics={cartAnalytics} />
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-white/40 backdrop-blur-xl border-t border-white/20 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Datos actualizados mensualmente • Analíticas de Changuito IA</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}