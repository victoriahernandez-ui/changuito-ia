'use client';

import { PriceEntry } from '@/types/product';

interface ProductCardProps {
  name: string;
  category: string;
  prices: PriceEntry[];
  bestStore: string;
  bestPrice: number;
  isAdded: boolean;
  onAddToCart: () => void;
}

export default function ProductCard({
  name,
  category,
  prices,
  bestStore,
  bestPrice,
  isAdded,
  onAddToCart,
}: ProductCardProps) {
  const highestPrice = Math.max(...prices.map((price) => price.price));
  const highestStore = prices[prices.length - 1]?.store ?? bestStore;
  const savings = highestPrice - bestPrice;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 transition duration-300 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
          <p className="text-slate-500 mt-2">{category}</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
          Best Price
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {prices.map((price) => {
          const isBest = price.store === bestStore && price.price === bestPrice;
          return (
            <div
              key={price.store}
              className={`flex justify-between items-center p-3 rounded-2xl transition ${
                isBest
                  ? 'bg-emerald-100 border border-emerald-300 shadow-sm'
                  : 'bg-slate-100 border border-transparent'
              }`}
            >
              <span className="font-medium text-slate-700">{price.store}</span>
              <span className={`font-bold ${isBest ? 'text-emerald-800' : 'text-slate-900'}`}>
                ${price.price}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-4 border border-slate-200">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-600">Mejor precio en</p>
          <span className="text-sm font-semibold text-slate-900">{bestStore}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-700">
          <span>
            Ahorra <span className="font-semibold text-slate-900">${savings}</span>
          </span>
          <span className="text-slate-500">vs {highestStore}</span>
        </div>
      </div>

      <button
        onClick={onAddToCart}
        className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          isAdded
            ? 'bg-slate-200 text-slate-700 cursor-not-allowed'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        }`}
        disabled={isAdded}
      >
        {isAdded ? 'Agregado al carrito' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
