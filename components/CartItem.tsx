'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItem({ product, quantity, onQuantityChange, onRemove }: CartItemProps) {
  const bestPrice = Math.min(...product.prices.map((price) => price.price));
  const subtotal = bestPrice * quantity;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">{product.name}</h4>
          <p className="mt-1 text-sm text-slate-500">{product.brand} · {product.category}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Precio unitario</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(bestPrice)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <button
            type="button"
            onClick={() => onQuantityChange(product.id, quantity - 1)}
            className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">{quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(product.id, quantity + 1)}
            className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 transition"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <span className="text-sm font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
