import { getAdapter, getAllAdapters } from "../adapters";
import type { InflationSeries, SupermarketId } from "../types";

/**
 * Inflation tracking for a single product.
 * If supermarketId is omitted, returns a cross-store average series.
 */
export async function getProductInflation(args: {
  productKey: string;
  months?: number;
  supermarketId?: SupermarketId;
}): Promise<InflationSeries | null> {
  const { productKey, months = 12, supermarketId } = args;

  if (supermarketId) {
    const adapter = getAdapter(supermarketId);
    if (!adapter.getInflationSeries) return null;
    const res = await adapter.getInflationSeries({ productKey, months });
    return res.ok ? res.data : null;
  }

  // Aggregate across stores.
  const adapters = getAllAdapters().filter((a) => a.getInflationSeries);
  const results = await Promise.all(
    adapters.map((a) => a.getInflationSeries!({ productKey, months })),
  );
  const series = results
    .filter((r) => r.ok)
    .map((r) => (r.ok ? r.data : null))
    .filter((s): s is InflationSeries => Boolean(s));

  if (series.length === 0) return null;

  const sample = series[0];
  const avgPoints = sample.points.map((_, idx) => {
    const month = sample.points[idx].month;
    const prices = series.map((s) => s.points[idx]?.avgPrice).filter((n): n is number => typeof n === "number");
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const prev = idx === 0 ? avgPrice : Math.round(
      series
        .map((s) => s.points[idx - 1]?.avgPrice ?? avgPrice)
        .reduce((a, b) => a + b, 0) / series.length,
    );
    const momPercent = idx === 0 ? 0 : +(((avgPrice / prev) - 1) * 100).toFixed(2);
    return { month, avgPrice, momPercent };
  });

  return {
    productKey,
    productName: sample.productName,
    category: sample.category,
    points: avgPoints,
  };
}
