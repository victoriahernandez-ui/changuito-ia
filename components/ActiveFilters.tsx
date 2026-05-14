'use client';

import { X } from 'lucide-react';
import { Filters } from '@/types/search';

interface ActiveFiltersProps {
  filters: Filters;
  onRemove: (type: keyof Filters, value: string | boolean) => void;
}

export default function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  const chips = [
    ...filters.categories.map((value) => ({ label: value, type: 'categories' as const, value })),
    ...filters.stores.map((value) => ({ label: value, type: 'stores' as const, value })),
    ...(filters.onlyOffers ? [{ label: 'En oferta', type: 'onlyOffers' as const, value: true }] : []),
    ...(filters.onlyFreeShipping ? [{ label: 'Envío gratis', type: 'onlyFreeShipping' as const, value: true }] : []),
    ...(filters.sortBy !== 'relevance' ? [{ label: filters.sortBy === 'cheapest' ? 'Menor precio' : filters.sortBy === 'bestRated' ? 'Mejor valorado' : 'Precio más alto', type: 'sortBy' as const, value: filters.sortBy }] : []),
  ];

  if (!chips.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
      {chips.map((chip) => (
        <button
          key={`${chip.type}-${chip.value}`}
          type="button"
          onClick={() => onRemove(chip.type, chip.value)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
        >
          {chip.label}
          <X className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
}
