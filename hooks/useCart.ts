'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Product } from '@/types/product';
import { clamp } from '@/lib/utils';

const STORAGE_KEY = 'smartcart-items';

export interface CartLine {
  productId: number;
  quantity: number;
}

export interface CartTotals {
  count: number;
  subtotal: number;
  savingsEstimate: number;
  storeComparisons: Array<{
    store: string;
    total: number;
    savings: number;
    isCheapest: boolean;
  }>;
  cheapestStore: string | null;
}

const normalizeStoredCart = (value: unknown): CartLine[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  if (value.every((item) => typeof item === 'number')) {
    return (value as number[]).map((productId) => ({ productId, quantity: 1 }));
  }

  if (
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'productId' in item &&
        'quantity' in item &&
        typeof (item as Record<string, unknown>).productId === 'number' &&
        typeof (item as Record<string, unknown>).quantity === 'number'
    )
  ) {
    return (value as CartLine[]).map((item) => ({
      productId: item.productId,
      quantity: Math.max(1, item.quantity),
    }));
  }

  return [];
};

export function useCart(products: Product[]) {
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      requestAnimationFrame(() => setIsReady(true));
      return;
    }

    requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCartLines(normalizeStoredCart(parsed));
        } catch {
          setCartLines([]);
        }
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartLines));
  }, [cartLines, isReady]);

  const addToCart = useCallback((productId: number) => {
    setCartLines((current) => {
      const exists = current.find((line) => line.productId === productId);
      if (exists) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: clamp(line.quantity + 1, 1, 99) }
            : line
        );
      }
      return [...current, { productId, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCartLines((current) =>
      current
        .map((line) =>
          line.productId === productId
            ? { ...line, quantity: clamp(quantity, 1, 99) }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartLines([]);
  }, []);

  const cartProducts = useMemo(
    () => products.filter((product) => cartLines.some((line) => line.productId === product.id)),
    [products, cartLines]
  );

  const count = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines]
  );

  const subtotal = useMemo(() => {
    return cartProducts.reduce((sum, product) => {
      const quantity = cartLines.find((line) => line.productId === product.id)?.quantity ?? 1;
      const bestPrice = Math.min(...product.prices.map((price) => price.price));
      return sum + bestPrice * quantity;
    }, 0);
  }, [cartProducts, cartLines]);

  const storeComparisons = useMemo(() => {
    const stores = Array.from(
      new Set(cartProducts.flatMap((product) => product.prices.map((price) => price.store)))
    );

    const totals = stores.map((store) => {
      const total = cartProducts.reduce((sum, product) => {
        const price = product.prices.find((item) => item.store === store)?.price ?? 0;
        const quantity = cartLines.find((line) => line.productId === product.id)?.quantity ?? 1;
        return sum + price * quantity;
      }, 0);
      return { store, total };
    });

    const best = totals.reduce((best, item) => (item.total < best.total ? item : best), totals[0] ?? { store: '', total: 0 });
    return totals.map((item) => ({
      store: item.store,
      total: item.total,
      savings: Math.max(0, (totals.reduce((acc, cur) => Math.max(acc, cur.total), 0) - item.total)),
      isCheapest: item.store === best.store,
    }));
  }, [cartProducts, cartLines]);

  const cheapestStore = useMemo(() => {
    const cheapest = storeComparisons.find((item) => item.isCheapest);
    return cheapest?.store ?? null;
  }, [storeComparisons]);

  const savingsEstimate = useMemo(() => {
    const highest = storeComparisons.reduce((max, item) => Math.max(max, item.total), 0);
    return Math.max(0, highest - subtotal);
  }, [storeComparisons, subtotal]);

  return {
    cartLines,
    cartProducts,
    count,
    subtotal,
    savingsEstimate,
    cheapestStore,
    storeComparisons,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isReady,
  };
}
