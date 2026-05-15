/**
 * Normalized domain types for Changuito IA pricing layer.
 * All supermarket adapters MUST map their raw responses into these shapes.
 */

export type SupermarketId =
  | "carrefour"
  | "coto"
  | "jumbo"
  | "disco"
  | "dia";

export interface Supermarket {
  id: SupermarketId;
  name: string;
  country: "AR";
  logoUrl?: string;
}

/** A product as offered by ONE supermarket at one point in time. */
export interface ProductOffer {
  /** Stable id within the supermarket (sku / ean / slug). */
  id: string;
  supermarketId: SupermarketId;
  /** Cross-store canonical id (EAN-13 when available). Used to group offers. */
  ean?: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  /** Final price the customer pays, in ARS. */
  price: number;
  /** Original/list price before discount, in ARS. */
  listPrice?: number;
  /** e.g. "$/kg", "$/L", "$/un". */
  pricePerUnit?: { value: number; unit: string };
  /** ISO timestamp the price was observed. */
  observedAt: string;
  /** Direct link to the product page in the store. */
  url?: string;
  inStock: boolean;
}

/** A canonical product grouping offers from multiple stores. */
export interface CanonicalProduct {
  /** EAN if known, otherwise a synthetic key. */
  key: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  offers: ProductOffer[];
}

export interface ProductSearchQuery {
  q: string;
  supermarkets?: SupermarketId[];
  category?: string;
  limit?: number;
  page?: number;
}

export interface ProductSearchResult {
  query: ProductSearchQuery;
  items: CanonicalProduct[];
  total: number;
  page: number;
  pageSize: number;
}

/** A single line in the user's cart, store-agnostic. */
export interface CartItem {
  productKey: string; // CanonicalProduct.key
  name: string;
  quantity: number;
  /** Optional pinned EAN for exact matching across stores. */
  ean?: string;
}

export interface StoreCartTotal {
  supermarketId: SupermarketId;
  supermarketName: string;
  /** Sum of matched items at this store. */
  subtotal: number;
  /** Items the store actually had a price for. */
  matchedItems: Array<{
    productKey: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  missingItems: Array<{ productKey: string; name: string; quantity: number }>;
  coverage: number; // 0..1 fraction of items matched
  observedAt: string;
}

export interface CartComparison {
  totals: StoreCartTotal[];
  cheapest?: StoreCartTotal;
  mostExpensive?: StoreCartTotal;
  /** Absolute and relative savings vs most expensive. */
  potentialSavings?: { amount: number; percent: number };
}

/** A monthly inflation observation for a tracked product/category. */
export interface InflationPoint {
  /** ISO month, e.g. "2026-04". */
  month: string;
  avgPrice: number;
  /** Month-over-month % change. */
  momPercent: number;
  /** Year-over-year % change. */
  yoyPercent?: number;
}

export interface InflationSeries {
  productKey: string;
  productName: string;
  category?: string;
  supermarketId?: SupermarketId; // omit for cross-store average
  points: InflationPoint[];
}

/** Standard envelope returned by every adapter call. */
export type ApiResult<T> =
  | { ok: true; data: T; source: SupermarketId | "aggregate" | "mock" }
  | { ok: false; error: ApiError; source: SupermarketId | "aggregate" | "mock" };

export interface ApiError {
  code:
    | "network"
    | "rate_limited"
    | "not_found"
    | "invalid_response"
    | "unauthorized"
    | "unknown";
  message: string;
  cause?: unknown;
}
