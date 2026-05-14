'use client';

import { PaymentMethod } from '@/data/bankPromotions';

interface PaymentSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentSelector({
  paymentMethods,
  selectedMethod,
  onSelect,
}: PaymentSelectorProps) {
  return (
    <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 font-semibold">Pago inteligente</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Selecciona tu forma de pago y encuentra la mejor promo</p>
        </div>
        <div className="min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 mb-2" htmlFor="payment-method">
            Método de pago
          </label>
          <select
            id="payment-method"
            value={selectedMethod}
            onChange={(event) => onSelect(event.target.value as PaymentMethod)}
            className="w-full bg-transparent text-slate-900 outline-none"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method === 'all' ? 'Mejor opción' : method}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
