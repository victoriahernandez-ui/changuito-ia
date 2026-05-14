'use client';

import { useState } from 'react';
import { BankPromotion, PaymentMethod } from '@/data/bankPromotions';
import { Product } from '@/types/product';
import PaymentSelector from '@/components/PaymentSelector';

interface CartLine {
  productId: number;
  quantity: number;
}

interface CartSummaryProps {
  cartLines: CartLine[];
  cartProducts: Product[];
  promotions: BankPromotion[];
}

interface StoreTotal {
  store: string;
  baseTotal: number;
  finalTotal: number;
  discount: number;
  bestPromotion: BankPromotion | null;
}

export default function CartSummary({ cartLines, cartProducts, promotions }: CartSummaryProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('all');
  const empty = cartLines.length === 0;

  const paymentMethods = [
    'all',
    ...Array.from(new Set(promotions.map((promotion) => promotion.paymentMethod))),
  ] as PaymentMethod[];

  const stores = Array.from(
    new Set(cartProducts.flatMap((product) => product.prices.map((price) => price.store)))
  );

  const storeTotals: StoreTotal[] = stores.map((store) => {
    const baseTotal = cartLines.reduce((sum, line) => {
      const product = cartProducts.find((item) => item.id === line.productId);
      if (!product) return sum;
      const price = product.prices.find((item) => item.store === store)?.price ?? 0;
      return sum + price * line.quantity;
    }, 0);

    const applicablePromos = promotions.filter(
      (promotion) =>
        promotion.store === store &&
        (selectedMethod === 'all' || promotion.paymentMethod === selectedMethod)
    );

    const bestPromotion = applicablePromos.reduce(
      (best, promotion) => {
        const discount = Math.min((baseTotal * promotion.discountPercent) / 100, promotion.maxDiscount);
        return discount > best.discount ? { promotion, discount } : best;
      },
      { promotion: null as BankPromotion | null, discount: 0 }
    );

    const discount = bestPromotion.discount;
    const finalTotal = baseTotal - discount;

    return {
      store,
      baseTotal,
      finalTotal,
      discount,
      bestPromotion: bestPromotion.promotion,
    };
  });

  const sortedTotals = [...storeTotals].sort((a, b) => a.finalTotal - b.finalTotal);
  const cheapest = sortedTotals[0] ?? null;
  const mostExpensive = sortedTotals[sortedTotals.length - 1] ?? null;
  const savings = cheapest && mostExpensive ? mostExpensive.finalTotal - cheapest.finalTotal : 0;

  return (
    <section className="mt-12">
      <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-2xl shadow-slate-900/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 font-semibold">Changuito IA</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">Resumen del carrito</h3>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {cartProducts.length} producto{cartProducts.length === 1 ? '' : 's'} agregado{cartProducts.length === 1 ? '' : 's'}
          </div>
        </div>

        <PaymentSelector
          paymentMethods={paymentMethods}
          selectedMethod={selectedMethod}
          onSelect={setSelectedMethod}
        />

        {empty ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            <p className="text-lg font-medium">Agrega productos para comparar los totales de cada supermercado.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <div className="grid gap-4">
                {sortedTotals.map((storeTotal, index) => {
                  const isBest = index === 0;
                  const promotionLabel = storeTotal.bestPromotion
                    ? `${storeTotal.bestPromotion.bank} ${storeTotal.bestPromotion.paymentMethod}`
                    : 'Sin promoción disponible';

                  return (
                    <div
                      key={storeTotal.store}
                      className={`rounded-3xl p-4 transition ${
                        isBest
                          ? 'bg-emerald-100 border border-emerald-300 shadow-sm'
                          : 'bg-white border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{storeTotal.store}</p>
                          <p className="text-xs text-slate-500">{promotionLabel}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-slate-900">${storeTotal.finalTotal}</p>
                          {storeTotal.discount > 0 && (
                            <p className="text-xs text-slate-500">- ${storeTotal.discount} descuento</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300 font-semibold">Mejor opción</p>
              <p className="mt-4 text-3xl font-bold">{cheapest?.store ?? 'N/A'}</p>
              <p className="mt-1 text-sm text-slate-400">Banco: {cheapest?.bestPromotion?.bank ?? 'N/A'}</p>
              <p className="mt-1 text-sm text-slate-400">Pago: {cheapest?.bestPromotion?.paymentMethod ?? 'N/A'}</p>
              <div className="mt-6 rounded-3xl bg-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Ahorro total</p>
                <p className="mt-3 text-3xl font-bold text-white">${savings}</p>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Diferencia entre el supermercado más barato y el más caro después de los descuentos.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
