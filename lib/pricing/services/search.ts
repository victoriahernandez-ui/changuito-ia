import { getAdapter, getAllAdapters } from "../adapters";
import { ALL_SUPERMARKET_IDS } from "../supermarkets";
import type {
  CanonicalProduct,
  ProductOffer,
  ProductSearchQuery,
  ProductSearchResult,
} from "../types";

/**
 * Cross-store product search. Fans out to each store adapter in parallel,
 * tolerates per-store failures, and groups results by EAN into CanonicalProducts.
 */
export async function searchProducts(
  query: ProductSearchQuery,
): Promise<ProductSearchResult> {
  const stores = (query.supermarkets ?? ALL_SUPERMARKET_IDS).map(getAdapter);

  const results = await Promise.allSettled(
    stores.map((s) => s.search(query)),
  );

  const offers: ProductOffer[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.ok) {
      offers.push(...r.value.data);
    }
    // Per-store failures are intentionally swallowed so the overall
    // search still returns useful data. Surface them via a separate
    // health endpoint if needed.
  }

  const grouped = groupByCanonical(offers);
  const limit = query.limit ?? 20;
  const page = query.page ?? 1;
  const start = (page - 1) * limit;

  return {
    query,
    items: grouped.slice(start, start + limit),
    total: grouped.length,
    page,
    pageSize: limit,
  };
}

function groupByCanonical(offers: ProductOffer[]): CanonicalProduct[] {
  const map = new Map<string, CanonicalProduct>();
  for (const o of offers) {
    const key = o.ean ?? `${o.supermarketId}:${o.id}`;
    const existing = map.get(key);
    if (existing) {
      existing.offers.push(o);
    } else {
      map.set(key, {
        key,
        name: o.name,
        brand: o.brand,
        category: o.category,
        imageUrl: o.imageUrl,
        offers: [o],
      });
    }
  }
  // Sort each product's offers cheapest first.
  for (const p of map.values()) {
    p.offers.sort((a, b) => a.price - b.price);
  }
  return Array.from(map.values());
}

export async function searchInStore(
  storeId: ReturnType<typeof getAllAdapters>[number]["id"],
  query: ProductSearchQuery,
) {
  return getAdapter(storeId).search(query);
}
