import type {
  ApiResult,
  InflationSeries,
  ProductOffer,
  ProductSearchQuery,
  SupermarketId,
} from "../types";
import type { SupermarketAdapter } from "./types";
import { buildOffer, findSeedByEan, searchSeeds, SEED_PRODUCTS } from "./mock-data";

interface MockAdapterOptions {
  /** Simulated latency in ms. */
  latencyMs?: number;
  /** 0..1 probability of a synthetic failure. */
  errorRate?: number;
}

/**
 * In-memory adapter implementing the SupermarketAdapter contract.
 * Swap with a real HTTP adapter per store without touching the service layer.
 */
export function createMockAdapter(
  storeId: SupermarketId,
  opts: MockAdapterOptions = {},
): SupermarketAdapter {
  const { latencyMs = 250, errorRate = 0 } = opts;

  const delay = () => new Promise((r) => setTimeout(r, latencyMs));
  const maybeFail = () => Math.random() < errorRate;

  return {
    id: storeId,

    async search(query: ProductSearchQuery): Promise<ApiResult<ProductOffer[]>> {
      await delay();
      if (maybeFail()) {
        return { ok: false, source: storeId, error: { code: "network", message: "Mock failure" } };
      }
      const seeds = searchSeeds(query.q);
      const limit = query.limit ?? 20;
      const offers = seeds.slice(0, limit).map((s) => buildOffer(s, storeId));
      return { ok: true, source: storeId, data: offers };
    },

    async getOffer({ id, ean }) {
      await delay();
      const targetEan = ean ?? id?.split("-").pop();
      if (!targetEan) {
        return { ok: false, source: storeId, error: { code: "not_found", message: "Missing id/ean" } };
      }
      const seed = findSeedByEan(targetEan);
      if (!seed) return { ok: true, source: storeId, data: null };
      return { ok: true, source: storeId, data: buildOffer(seed, storeId) };
    },

    async getOffersByEan(eans: string[]): Promise<ApiResult<ProductOffer[]>> {
      await delay();
      if (maybeFail()) {
        return { ok: false, source: storeId, error: { code: "network", message: "Mock failure" } };
      }
      const offers = eans
        .map((e) => findSeedByEan(e))
        .filter((s): s is NonNullable<typeof s> => Boolean(s))
        .map((s) => buildOffer(s, storeId));
      return { ok: true, source: storeId, data: offers };
    },

    async getInflationSeries({ productKey, months = 12 }): Promise<ApiResult<InflationSeries>> {
      await delay();
      const seed = findSeedByEan(productKey) ?? SEED_PRODUCTS[0];
      const now = new Date();
      const points = Array.from({ length: months }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
        // Roughly 6% monthly inflation, decaying as we approach now.
        const monthsAgo = months - 1 - i;
        const factor = Math.pow(1.06, -monthsAgo);
        const avgPrice = Math.round(seed.basePrice * factor);
        return {
          month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
          avgPrice,
          momPercent: i === 0 ? 0 : +(((avgPrice / Math.round(seed.basePrice * Math.pow(1.06, -(monthsAgo + 1)))) - 1) * 100).toFixed(2),
          yoyPercent: i >= 12 ? undefined : undefined,
        };
      });
      return {
        ok: true,
        source: storeId,
        data: {
          productKey,
          productName: seed.name,
          category: seed.category,
          supermarketId: storeId,
          points,
        },
      };
    },
  };
}
