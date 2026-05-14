'use client';

import { useMemo, useState } from 'react';
import { ShoppingBag, Star, Users, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SearchBar from '@/components/SearchBar';
import SearchSuggestions from '@/components/SearchSuggestions';
import FilterSidebar from '@/components/FilterSidebar';
import ActiveFilters from '@/components/ActiveFilters';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import CartSummary from '@/components/CartSummary';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import StatsSection from '@/components/StatsSection';
import { bankPromotions } from '@/data/bankPromotions';
import { products } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { useFilters, defaultFilters } from '@/hooks/useFilters';
import { useSearch } from '@/hooks/useSearch';

export default function LandingPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const {
    query,
    setQuery,
    filteredProducts: searchResults,
    isLoading,
    recentSearches,
    popularQueries,
    suggestionSections,
    clearHistory,
    pickSuggestion,
    debouncedQuery,
  } = useSearch(products);

  const {
    filters,
    setFilters,
    filteredProducts,
    categories,
    stores,
  } = useFilters(searchResults);

  const {
    cartLines,
    cartProducts,
    count,
    subtotal,
    savingsEstimate,
    cheapestStore,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart(products);

  const sectionTitle = query ? `Resultados para “${debouncedQuery}”` : 'Catálogo recomendado';
  const hasResults = filteredProducts.length > 0;

  const handleRemoveFilter = (type: keyof typeof filters, value: string | boolean) => {
    switch (type) {
      case 'categories':
        setFilters({ ...filters, categories: filters.categories.filter((item) => item !== value) });
        break;
      case 'stores':
        setFilters({ ...filters, stores: filters.stores.filter((item) => item !== value) });
        break;
      case 'onlyOffers':
        setFilters({ ...filters, onlyOffers: false });
        break;
      case 'onlyFreeShipping':
        setFilters({ ...filters, onlyFreeShipping: false });
        break;
      case 'sortBy':
        setFilters({ ...filters, sortBy: 'relevance' });
        break;
      default:
        break;
    }
  };

  const filteredStores = useMemo(
    () => [
      { id: 1, name: 'Carrefour', avgPrice: 1250, productCount: 45000, locations: 120, rating: 4.5, discount: 15, logo: '🛒' },
      { id: 2, name: 'Walmart', avgPrice: 1180, productCount: 50000, locations: 95, rating: 4.3, discount: 22, logo: '🏪' },
      { id: 3, name: 'Día', avgPrice: 980, productCount: 12000, locations: 300, rating: 4.1, discount: 18, logo: '🏬' },
      { id: 4, name: 'Coto', avgPrice: 1400, productCount: 55000, locations: 138, rating: 4.6, discount: 12, logo: '🛍️' },
      { id: 5, name: 'Jumbo', avgPrice: 1320, productCount: 42000, locations: 87, rating: 4.4, discount: 14, logo: '🏬' },
      { id: 6, name: 'Disco', avgPrice: 1100, productCount: 35000, locations: 72, rating: 4.2, discount: 20, logo: '🎪' },
    ].filter((store) => store.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <>
      <Navbar />

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartLines={cartLines}
        products={products}
        subtotal={subtotal}
        savingsEstimate={savingsEstimate}
        cheapestStore={cheapestStore}
        onQuantityChange={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
      />

      <main className="bg-white">
        <HeroSection />

        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Comparador Inteligente</p>
              <h2 className="text-5xl font-bold text-slate-900">Encuentra los mejores precios en cada compra</h2>
              <p className="max-w-3xl text-lg leading-8 text-slate-600">
                Explora nuestra plataforma de comparación de precios, construida para ayudarte a ahorrar en el supermercado todos los días.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-3 rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:bg-slate-800"
            >
              <ShoppingBag className="w-5 h-5" />
              Ver carrito ({count})
            </button>
          </div>

          <div className="mt-12 space-y-8">
            <SearchBar
              searchQuery={query}
              setSearchQuery={setQuery}
              popularQueries={popularQueries}
              onPickSuggestion={pickSuggestion}
            />
            <SearchSuggestions
              query={query}
              recent={recentSearches}
              popular={popularQueries}
              sections={suggestionSections}
              onSelect={pickSuggestion}
              onClearHistory={clearHistory}
            />
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto grid gap-8 xl:grid-cols-[320px_minmax(0,_1fr)]">
            <FilterSidebar
              filters={filters}
              categories={categories}
              stores={stores}
              onChange={setFilters}
            />

            <div>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">{sectionTitle}</p>
                  <h3 className="mt-3 text-3xl font-semibold text-slate-900">Resultados actualizados en tiempo real</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFilters(defaultFilters)}
                  className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Limpiar filtros
                </button>
              </div>

              <ActiveFilters filters={filters} onRemove={handleRemoveFilter} />

              {isLoading ? (
                <LoadingSkeleton />
              ) : !hasResults ? (
                <EmptyState query={debouncedQuery} />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
                    const cheapest = sortedPrices[0];

                    return (
                      <ProductCard
                        key={product.id}
                        name={product.name}
                        category={product.category}
                        prices={sortedPrices}
                        bestStore={cheapest.store}
                        bestPrice={cheapest.price}
                        isAdded={cartLines.some((line) => line.productId === product.id)}
                        onAddToCart={() => addToCart(product.id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <CartSummary cartLines={cartLines} cartProducts={cartProducts} promotions={bankPromotions} />

        <StatsSection
          statistics={[
            { label: 'Usuarios ahorrando', value: '500K+', suffix: '', icon: <Users className="w-10 h-10" /> },
            { label: 'Ahorro promedio', value: '32%', suffix: '', icon: <Sparkles className="w-10 h-10" /> },
            { label: 'Compras seguras', value: '100%', suffix: '', icon: <ShieldCheck className="w-10 h-10" /> },
            { label: 'Comparaciones en tiempo real', value: '24/7', suffix: '', icon: <TrendingUp className="w-10 h-10" /> },
          ]}
        />

        <section id="stores" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-5xl font-bold text-slate-900">Supermercados Argentinos</h2>
              <p className="text-lg text-slate-600 font-light">
                Comparamos precios en {filteredStores.length} supermercados principales
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className="group cursor-pointer bg-white/40 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/40"
                >
                  <div className="relative bg-gradient-to-br from-slate-50/40 to-blue-50/40 backdrop-blur-md p-7 pb-24 border-b border-white/20">
                    <div className="flex items-start justify-between">
                      <div className="text-5xl group-hover:scale-110 transition duration-300">{store.logo}</div>
                      <div className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-blue-400/50">
                        -{store.discount}%
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mt-5">{store.name}</h3>
                    <div className="absolute bottom-0 right-0 w-28 h-28 bg-blue-300 rounded-full opacity-10 filter blur-2xl group-hover:opacity-20 transition duration-500"></div>
                  </div>

                  <div className="p-7 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(store.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{store.rating}</span>
                    </div>

                    <div className="space-y-4 py-5 border-t border-b border-white/30">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-medium">Precio Promedio</span>
                        <span className="font-bold text-xl text-slate-900">
  ${store.avgPrice.toLocaleString('es-AR')}
</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-medium">Productos</span>
                        <span className="font-bold text-slate-900">
  {store.productCount.toLocaleString('es-AR')}
</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm font-medium">Sucursales</span>
                        <span className="font-bold text-slate-900">{store.locations}</span>
                      </div>
                    </div>

                    <button className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
                      Explorar ofertas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
