# Pricing layer — Changuito IA

Backend-agnostic API layer for supermarket price comparison, cart optimization
and inflation tracking. The UI talks ONLY to this module.

```
src/lib/pricing/
├── types.ts                 Normalized domain types (ProductOffer, CartItem, …)
├── supermarkets.ts          Static catalogue of supported stores
├── adapters/
│   ├── types.ts             SupermarketAdapter contract
│   ├── mock-data.ts         Seed catalogue + deterministic price noise
│   ├── mock-adapter.ts      In-memory implementation of the contract
│   └── index.ts             Adapter registry (swap mock → real here)
├── services/
│   ├── search.ts            Cross-store search + EAN grouping
│   ├── cart.ts              Cart total comparison
│   └── inflation.ts         Per-product / aggregate inflation series
├── server/
│   └── functions.ts         createServerFn wrappers (Zod-validated)
└── hooks.ts                 React Query hooks for components
```

## Supported supermarkets
Carrefour · Coto · Jumbo · Disco · Día (all `country: "AR"`).

## Using it from the UI

```tsx
import { useProductSearch, useCartComparison, type CartItem } from "@/lib/pricing";

function Search() {
  const { data, isLoading, error } = useProductSearch({ q: "leche" });
  if (isLoading) return <Spinner />;
  if (error)     return <ErrorState onRetry={() => location.reload()} />;
  return data?.items.map(p => <ProductCard key={p.key} product={p} />);
}

const cart: CartItem[] = [
  { productKey: "7790070410016", name: "Leche 1L", quantity: 2, ean: "7790070410016" },
];
const { data: comparison } = useCartComparison(cart);
// comparison.cheapest, comparison.potentialSavings, …
```

## Wiring a real API later

1. Create `adapters/carrefour-adapter.ts` exporting a function that returns a
   `SupermarketAdapter`. Inside its methods, call the real HTTP endpoint and
   map the response into `ProductOffer` / `InflationSeries`.
2. In `adapters/index.ts`, replace `createMockAdapter("carrefour")` with your
   new factory. **No other file changes.**
3. Add any required secrets via Lovable's secrets manager (e.g.
   `CARREFOUR_API_KEY`). Read them only inside the adapter, which itself is
   only ever invoked from a `createServerFn` handler — keys never reach the
   client bundle.

## Error & loading model

- Adapters return `ApiResult<T>` (`{ ok: true, data } | { ok: false, error }`)
  so per-store failures don't crash aggregations.
- Services tolerate partial failures (e.g. one store down → other 4 still
  returned).
- Hooks expose React Query's `isLoading`, `isError`, `error`, `refetch`.
