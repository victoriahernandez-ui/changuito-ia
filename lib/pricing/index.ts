/**
 * Public surface of the pricing layer.
 *
 * UI code should ONLY import from this module:
 *   import { useProductSearch, useCartComparison, type CartItem } from "@/lib/pricing";
 *
 * Internal modules (adapters/, services/, server/) are implementation details.
 */

export * from "./types";
export { SUPERMARKETS, ALL_SUPERMARKET_IDS } from "./supermarkets";
export {
  useProductSearch,
  useCartComparison,
  useInflation,
  useCompareCartMutation,
} from "./hooks";
export {
  searchProductsFn,
  compareCartFn,
  getInflationFn,
} from "./server/functions";
