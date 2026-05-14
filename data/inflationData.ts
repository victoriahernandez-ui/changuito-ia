export interface HistoricalPrice {
  date: string; // YYYY-MM-DD format
  price: number;
}

export interface ProductHistory {
  productId: number;
  productName: string;
  category: string;
  store: string;
  history: HistoricalPrice[];
}

export interface InflationData {
  month: string; // YYYY-MM format
  inflation: number; // percentage
  categoryInflation: Record<string, number>;
  topIncreases: Array<{
    productId: number;
    productName: string;
    increase: number; // percentage
    category: string;
  }>;
}

// Generate mock historical data for the last 12 months
const generateHistoricalData = (): ProductHistory[] => {
  const products = [
    { id: 1, name: 'Leche La Serenísima 1L', category: 'Lácteos' },
    { id: 2, name: 'Pan Lactal Fargo 500g', category: 'Panificados' },
    { id: 3, name: 'Aceite Natura 900ml', category: 'Almacén' },
    { id: 4, name: 'Arroz Gallo Oro 1kg', category: 'Almacén' },
    { id: 5, name: 'Fideos Matarazzo 500g', category: 'Almacén' },
    { id: 6, name: 'Yogur La Serenísima 1kg', category: 'Lácteos' },
    { id: 7, name: 'Queso Cremoso La Serenísima 500g', category: 'Lácteos' },
    { id: 8, name: 'Manteca La Serenísima 200g', category: 'Lácteos' },
    { id: 9, name: 'Café Cabrales 500g', category: 'Almacén' },
    { id: 10, name: 'Azúcar Ledesma 1kg', category: 'Almacén' },
  ];

  const stores = ['Día', 'Carrefour', 'Coto', 'Disco', 'Jumbo'];
  const history: ProductHistory[] = [];

  // Generate data for the last 12 months
  const today = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7)); // YYYY-MM format
  }

  const getDeterministicValue = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) / 0x7fffffff;
  };

  products.forEach(product => {
    stores.forEach((store, storeIndex) => {
      const productHistory: ProductHistory = {
        productId: product.id,
        productName: product.name,
        category: product.category,
        store,
        history: []
      };

      const baseSeed = `${product.id}-${store}`;
      let basePrice = 500 + product.id * 100 + storeIndex * 40 + Math.floor(getDeterministicValue(baseSeed) * 150);

      months.forEach((month, index) => {
        const inflationSeed = `${product.id}-${store}-${month}`;
        const inflationVariance = getDeterministicValue(inflationSeed) * 0.05 - 0.025;
        const inflationFactor = 1 + index * 0.02 + inflationVariance;
        const price = Math.round(basePrice * inflationFactor);

        productHistory.history.push({
          date: month + '-15',
          price
        });

        basePrice = price;
      });

      history.push(productHistory);
    });
  });

  return history;
};

export const historicalPrices = generateHistoricalData();

// Calculate inflation data
export const calculateInflationData = (): InflationData[] => {
  // Generate the same months as in generateHistoricalData
  const today = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7)); // YYYY-MM format
  }

  return months.map((month, index) => {
    if (index === 0) {
      // First month has no previous data
      return {
        month,
        inflation: 0,
        categoryInflation: {},
        topIncreases: []
      };
    }

    const currentMonthData = historicalPrices.filter(h => h.history.some(p => p.date.startsWith(month)));
    const previousMonth = months[index - 1];
    const previousMonthData = historicalPrices.filter(h => h.history.some(p => p.date.startsWith(previousMonth)));

    // Calculate average prices for each product-store combination
    const currentAverages: Record<string, number> = {};
    const previousAverages: Record<string, number> = {};

    currentMonthData.forEach(h => {
      const currentPrice = h.history.find(p => p.date.startsWith(month))?.price || 0;
      currentAverages[`${h.productId}-${h.store}`] = currentPrice;
    });

    previousMonthData.forEach(h => {
      const previousPrice = h.history.find(p => p.date.startsWith(previousMonth))?.price || 0;
      previousAverages[`${h.productId}-${h.store}`] = previousPrice;
    });

    // Calculate inflation for each product
    const productInflations: Array<{
      productId: number;
      productName: string;
      category: string;
      inflation: number;
    }> = [];

    Object.keys(currentAverages).forEach(key => {
      const currentPrice = currentAverages[key];
      const previousPrice = previousAverages[key];

      if (previousPrice > 0) {
        const inflation = ((currentPrice - previousPrice) / previousPrice) * 100;
        const [productIdStr] = key.split('-');
        const productId = parseInt(productIdStr);
        const product = historicalPrices.find(h => h.productId === productId);

        if (product) {
          productInflations.push({
            productId,
            productName: product.productName,
            category: product.category,
            inflation
          });
        }
      }
    });

    // Calculate overall inflation (weighted average)
    const totalInflation = productInflations.length > 0
      ? productInflations.reduce((sum, p) => sum + p.inflation, 0) / productInflations.length
      : 0;

    // Calculate category inflation
    const categoryInflation: Record<string, number> = {};
    const categories = [...new Set(productInflations.map(p => p.category))];

    categories.forEach(category => {
      const categoryProducts = productInflations.filter(p => p.category === category);
      if (categoryProducts.length > 0) {
        categoryInflation[category] = categoryProducts.reduce((sum, p) => sum + p.inflation, 0) / categoryProducts.length;
      }
    });

    // Get top 5 increases
    const topIncreases = productInflations
      .sort((a, b) => b.inflation - a.inflation)
      .slice(0, 5)
      .map(p => ({
        productId: p.productId,
        productName: p.productName,
        increase: p.inflation,
        category: p.category
      }));

    return {
      month,
      inflation: totalInflation,
      categoryInflation,
      topIncreases
    };
  });
};

export const inflationData = calculateInflationData();

// Calculate Changuito IA inflation index (basket of essential goods)
export const calculateSmartCartIndex = () => {
  const basketProducts = [1, 2, 3, 4, 6, 9]; // Essential products: milk, bread, oil, rice, yogurt, coffee

  // Generate the same months as in generateHistoricalData
  const today = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7)); // YYYY-MM format
  }

  return months.map(month => {
    const monthData = historicalPrices.filter(h =>
      basketProducts.includes(h.productId) &&
      h.history.some(p => p.date.startsWith(month))
    );

    const averagePrice = monthData.reduce((sum, h) => {
      const price = h.history.find(p => p.date.startsWith(month))?.price || 0;
      return sum + price;
    }, 0) / monthData.length;

    return {
      month,
      index: averagePrice,
      date: new Date(month + '-01')
    };
  });
};

export const smartCartIndex = calculateSmartCartIndex();