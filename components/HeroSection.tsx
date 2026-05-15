import Link from 'next/link';
import { TrendingDown, MapPin, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                Compras
                <span className="block bg-gradient-to-r from-blue-600 to-slate-700 bg-clip-text text-transparent">
                  inteligentes
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-light">
                Comparación de precios en tiempo real con IA. Ahorra en cada compra en los principales supermercados argentinos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/#products-search"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-lg font-semibold transition duration-300 ease-out shadow-lg hover:shadow-xl"
              >
                <Zap className="w-5 h-5" />
                Comenzar a Comparar
              </Link>
              <Link
                href="/#stats"
                className="inline-flex items-center justify-center border-2 border-slate-900 text-slate-900 hover:bg-slate-50 px-8 py-3.5 rounded-lg font-semibold transition duration-300 ease-out"
              >
                Saber Más
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-slate-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="font-medium">500K+ compradores en Argentina</span>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative hidden md:block">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-4 border border-white/40 hover:shadow-3xl transition duration-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-50/40 to-slate-50/40 backdrop-blur-md rounded-xl border border-white/50 hover:border-blue-300/50 transition">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Ahorro en Leche</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">$45</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-5 bg-gradient-to-br from-blue-50/40 to-slate-50/40 backdrop-blur-md rounded-xl border border-white/50 hover:border-blue-300/50 transition">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Mejor Precio</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">Día Supermercados</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-md rounded-xl text-center text-white shadow-lg border border-white/10">
                    <p className="text-4xl font-bold">32%</p>
                    <p className="text-xs text-slate-300 mt-2 font-medium">Ahorro Promedio</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-blue-600/80 to-blue-700/80 backdrop-blur-md rounded-xl text-center text-white shadow-lg border border-white/10">
                    <p className="text-4xl font-bold">45+</p>
                    <p className="text-xs text-blue-100 mt-2 font-medium">Supermercados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
