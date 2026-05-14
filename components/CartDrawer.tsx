'use client';

import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { Product } from '@/types/product';
import CartItem from '@/components/CartItem';
import { formatCurrency } from '@/lib/utils';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartLines: Array<{ productId: number; quantity: number }>;
  products: Product[];
  subtotal: number;
  savingsEstimate: number;
  cheapestStore: string | null;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  cartLines,
  products,
  subtotal,
  savingsEstimate,
  cheapestStore,
  onQuantityChange,
  onRemove,
  onClear,
}: CartDrawerProps) {
  const cartProducts = products.filter((product) => cartLines.some((line) => line.productId === product.id));

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl transition-transform duration-300 ease-out"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Carrito Inteligente</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Tu comparación de precios</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-3 text-slate-700 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {cartProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-slate-500" />
              <p className="text-lg font-semibold text-slate-900">El carrito está vacío</p>
              <p className="mt-2 text-sm text-slate-500">Agrega productos y compara precios automáticamente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartLines.map((line) => {
                const product = products.find((product) => product.id === line.productId);
                if (!product) return null;
                return (
                  <CartItem
                    key={line.productId}
                    product={product}
                    quantity={line.quantity}
                    onQuantityChange={onQuantityChange}
                    onRemove={onRemove}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Subtotal estimado</span>
              <strong className="text-lg text-slate-900">{formatCurrency(subtotal)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Ahorro estimado</span>
              <strong className="text-lg text-emerald-700">{formatCurrency(savingsEstimate)}</strong>
            </div>
            <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
              <p className="font-semibold text-slate-900">Supermercado más barato</p>
              <p>{cheapestStore ?? 'Sin datos'}</p>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                type="button"
                onClick={onClear}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Vaciar carrito
              </button>
              <button
                type="button"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                Ir a pagar
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
