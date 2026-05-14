'use client';

import { Filter } from 'lucide-react';
import { Filters } from '@/types/search';
import PriceRangeSlider from '@/components/PriceRangeSlider';

interface FilterSidebarProps {
  filters: Filters;
  categories: string[];
  stores: string[];
  onChange: (next: Filters) => void;
}

export default function FilterSidebar({ filters, categories, stores, onChange }: FilterSidebarProps) {
  const handleToggleCategory = (category: string) => {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((item) => item !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories: next });
  };

  const handleToggleStore = (store: string) => {
    const next = filters.stores.includes(store)
      ? filters.stores.filter((item) => item !== store)
      : [...filters.stores, store];
    onChange({ ...filters, stores: next });
  };

  const handleToggleOption = (key: keyof Filters) => {
    if (typeof filters[key] === 'boolean') {
      onChange({ ...filters, [key]: !(filters[key] as boolean) } as Filters);
    }
  };

  const handleSort = (sortBy: Filters['sortBy']) => onChange({ ...filters, sortBy });

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5">
      <div className="flex items-center gap-3 text-slate-700 mb-6">
        <Filter className="w-5 h-5 text-slate-500" />
        <h2 className="text-lg font-semibold">Filtros avanzados</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">Categoría</p>
          <div className="grid gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleToggleCategory(category)}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  filters.categories.includes(category)
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">Supermercado</p>
          <div className="grid gap-2">
            {stores.map((store) => (
              <button
                key={store}
                type="button"
                onClick={() => handleToggleStore(store)}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  filters.stores.includes(store)
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {store}
              </button>
            ))}
          </div>
        </div>

        <PriceRangeSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onRangeChange={(minPrice, maxPrice) => onChange({ ...filters, minPrice, maxPrice })}
        />

        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => handleToggleOption('onlyOffers')}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              filters.onlyOffers ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            Ofertas activas
          </button>
          <button
            type="button"
            onClick={() => handleToggleOption('onlyFreeShipping')}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              filters.onlyFreeShipping ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            Envío gratis
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-3">Ordenar por</p>
          <div className="grid gap-2">
            {[
              { label: 'Relevancia', value: 'relevance' },
              { label: 'Precio más barato', value: 'cheapest' },
              { label: 'Precio más alto', value: 'priceDesc' },
              { label: 'Mejor valorado', value: 'bestRated' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSort(option.value as Filters['sortBy'])}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  filters.sortBy === option.value
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({
            categories: [],
            stores: [],
            minPrice: 0,
            maxPrice: 10000,
            onlyOffers: false,
            onlyFreeShipping: false,
            sortBy: 'relevance',
          })}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
