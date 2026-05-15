import type {
  ApiResult,
  InflationSeries,
  ProductOffer,
  ProductSearchQuery,
  SupermarketId,
} from "../types";

/**
 * Contract every supermarket adapter must implement.
 * Mock adapters and real HTTP adapters both satisfy this interface,
 * so the service layer never needs to know which is in use.
 */
export interface SupermarketAdapter {
  readonly id: SupermarketId;

  /** Free-text product search within this single supermarket. */
  search(query: ProductSearchQuery): Promise<ApiResult<ProductOffer[]>>;

  /** Fetch a specific offer by store-internal id or EAN. */
  getOffer(args: { id?: string; ean?: string }): Promise<ApiResult<ProductOffer | null>>;

  /** Bulk lookup by EAN (used by cart comparison). */
  getOffersByEan(eans: string[]): Promise<ApiResult<ProductOffer[]>>;

  /** Historical price points for inflation tracking (optional). */
  getInflationSeries?(args: {
    productKey: string;
    months?: number;
  }): Promise<ApiResult<InflationSeries>>;
}
