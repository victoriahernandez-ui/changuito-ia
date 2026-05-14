'use client';

import { TrendingUp, Package } from 'lucide-react';

interface TopIncrease {
  productId: number;
  productName: string;
  increase: number;
  category: string;
}

interface TopIncreasesListProps {
  products: TopIncrease[];
}

export default function TopIncreasesList({ products }: TopIncreasesListProps) {
  return (
    <div className="space-y-4 max-h-80 overflow-y-auto">
      {products.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay datos disponibles</p>
        </div>
      ) : (
        products.map((product, index) => (
          <div
            key={product.productId}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50/50 to-orange-50/50 rounded-xl border border-red-100/50 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                <span className="text-sm font-bold text-red-700">#{index + 1}</span>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                  {product.productName}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {product.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="font-bold text-red-700 text-lg">
                +{product.increase.toFixed(1)}%
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}