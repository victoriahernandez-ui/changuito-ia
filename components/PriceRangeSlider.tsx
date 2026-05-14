'use client';

import { useMemo } from 'react';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onRangeChange: (minPrice: number, maxPrice: number) => void;
}

export default function PriceRangeSlider({ minPrice, maxPrice, onRangeChange }: PriceRangeSliderProps) {
  const display = useMemo(
    () => `${minPrice.toLocaleString('es-AR')} - ${maxPrice.toLocaleString('es-AR')}`,
    [minPrice, maxPrice]
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Rango de precio</p>
          <p className="text-sm font-semibold text-slate-900">{display}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Min</label>
          <input
            type="range"
            min={0}
            max={10000}
            step={50}
            value={minPrice}
            onChange={(event) => onRangeChange(Number(event.target.value), maxPrice)}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="grid gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Max</label>
          <input
            type="range"
            min={0}
            max={10000}
            step={50}
            value={maxPrice}
            onChange={(event) => onRangeChange(minPrice, Number(event.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
