import { useQuery, useMutation, type UseQueryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  compareCartFn,
  getInflationFn,
  searchProductsFn,
} from "./server/functions";
import type {
  CartComparison,
  CartItem,
  InflationSeries,
  ProductSearchQuery,
  ProductSearchResult,
  SupermarketId,
} from "./types";

/**
 * React Query hooks. Components should use these — never call adapters directly.
 * Built-in loading / error / refetch states are exposed via the returned query.
 */

export function useProductSearch(
  query: ProductSearchQuery | null,
  options?: Partial<UseQueryOptions<ProductSearchResult>>,
) {
  const fn = useServerFn(searchProductsFn);
  return useQuery<ProductSearchResult>({
    queryKey: ["pricing", "search", query],
    queryFn: () => fn({ data: query! }),
    enabled: Boolean(query?.q),
    staleTime: 60_000,
    ...options,
  });
}

export function useCartComparison(
  items: CartItem[],
  supermarkets?: SupermarketId[],
  options?: Partial<UseQueryOptions<CartComparison>>,
) {
  const fn = useServerFn(compareCartFn);
  return useQuery<CartComparison>({
    queryKey: ["pricing", "cart", items, supermarkets],
    queryFn: () => fn({ data: { items, supermarkets } }),
    enabled: items.length > 0,
    staleTime: 30_000,
    ...options,
  });
}

export function useInflation(args: {
  productKey: string | null;
  months?: number;
  supermarketId?: SupermarketId;
}) {
  const fn = useServerFn(getInflationFn);
  return useQuery<InflationSeries | null>({
    queryKey: ["pricing", "inflation", args],
    queryFn: () =>
      fn({
        data: {
          productKey: args.productKey!,
          months: args.months,
          supermarketId: args.supermarketId,
        },
      }),
    enabled: Boolean(args.productKey),
    staleTime: 5 * 60_000,
  });
}

/** Imperative mutation variant if you need to trigger a comparison on click. */
export function useCompareCartMutation() {
  const fn = useServerFn(compareCartFn);
  return useMutation({
    mutationFn: (vars: { items: CartItem[]; supermarkets?: SupermarketId[] }) =>
      fn({ data: vars }),
  });
}
