import { Product } from '@/types/product';
import { historicalPrices } from '@/data/inflationData';

export interface CartAnalytics {
  mostExpensiveProducts: Array<{
    product: Product;
    totalPrice: number;
    cheapestStore: string;
    savings: number;
  }>;
  cheapestSupermarkets: Array<{
    store: string;
    totalPrice: number;
    savings: number;
    percentage: number;
  }>;
  averageCartInflation: number;
  monthlySpendingSimulation: Array<{
    month: string;
    estimatedCost: number;
    inflation: number;
  }>;
}

// Calculate cart analytics based on current cart
export const calculateCartAnalytics = (cartProducts: Product[]): CartAnalytics => {
  if (cartProducts.length === 0) {
    return {
      mostExpensiveProducts: [],
      cheapestSupermarkets: [],
      averageCartInflation: 0,
      monthlySpendingSimulation: []
    };
  }

  // Most expensive products (by highest savings potential)
  const mostExpensiveProducts = cartProducts.map(product => {
    const sortedPrices = [...product.prices].sort((a, b) => b.price - a.price);
    const mostExpensive = sortedPrices[0];
    const cheapest = sortedPrices[sortedPrices.length - 1];
    const savings = mostExpensive.price - cheapest.price;

    return {
      product,
      totalPrice: mostExpensive.price,
      cheapestStore: cheapest.store,
      savings
    };
  }).sort((a, b) => b.savings - a.savings).slice(0, 5);

  // Cheapest supermarkets for entire cart
  const storeTotals: Record<string, number> = {};
  cartProducts.forEach(product => {
    product.prices.forEach(price => {
      storeTotals[price.store] = (storeTotals[price.store] || 0) + price.price;
    });
  });

  const sortedStores = Object.entries(storeTotals)
    .map(([store, total]) => ({ store, total }))
    .sort((a, b) => a.total - b.total);

  const cheapest = sortedStores[0];
  const mostExpensiveStore = sortedStores[sortedStores.length - 1];

  const cheapestSupermarkets = sortedStores.map(store => ({
    store: store.store,
    totalPrice: store.total,
    savings: mostExpensiveStore.total - store.total,
    percentage: ((mostExpensiveStore.total - store.total) / mostExpensiveStore.total) * 100
  }));

  // Average cart inflation (based on historical data)
  const cartProductIds = cartProducts.map(p => p.id);
  const cartHistoricalData = historicalPrices.filter(h => cartProductIds.includes(h.productId));

  let totalInflation = 0;
  let inflationCount = 0;

  cartHistoricalData.forEach(productHistory => {
    const history = productHistory.history;
    for (let i = 1; i < history.length; i++) {
      const currentPrice = history[i].price;
      const previousPrice = history[i - 1].price;
      if (previousPrice > 0) {
        const inflation = ((currentPrice - previousPrice) / previousPrice) * 100;
        totalInflation += inflation;
        inflationCount++;
      }
    }
  });

  const averageCartInflation = inflationCount > 0 ? totalInflation / inflationCount : 0;

  // Monthly spending simulation (project cart cost with inflation)
  const currentMonth = new Date();
  const monthlySpendingSimulation = [];

  for (let i = 0; i < 12; i++) {
    const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
    const monthStr = month.toISOString().slice(0, 7);

    // Calculate base cost (current prices)
    const baseCost = cartProducts.reduce((sum, product) => {
      const cheapestPrice = Math.min(...product.prices.map(p => p.price));
      return sum + cheapestPrice;
    }, 0);

    // Apply cumulative inflation
    const inflationFactor = 1 + (averageCartInflation / 100) * i;
    const estimatedCost = baseCost * inflationFactor;

    monthlySpendingSimulation.push({
      month: monthStr,
      estimatedCost: Math.round(estimatedCost),
      inflation: averageCartInflation
    });
  }

  return {
    mostExpensiveProducts,
    cheapestSupermarkets,
    averageCartInflation,
    monthlySpendingSimulation
  };
};

// Save cart data to localStorage
export const saveCartToStorage = (cartItems: number[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('smartcart-items', JSON.stringify(cartItems));
  }
};

// Load cart data from localStorage
export const loadCartFromStorage = (): number[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('smartcart-items');
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        if (parsed.every((item) => typeof item === 'number')) {
          return parsed.filter((id) => typeof id === 'number');
        }

        if (
          parsed.every(
            (item) =>
              typeof item === 'object' &&
              item !== null &&
              'productId' in item &&
              typeof (item as any).productId === 'number'
          )
        ) {
          return (parsed as Array<{ productId: number }>).map((item) => item.productId);
        }
      }
      return [];
    } catch {
      return [];
    }
  }

  return [];
};