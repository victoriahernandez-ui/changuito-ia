import { getAdapter } from "../adapters";
import { ALL_SUPERMARKET_IDS, SUPERMARKETS } from "../supermarkets";
import type {
  CartComparison,
  CartItem,
  ProductOffer,
  StoreCartTotal,
  SupermarketId,
} from "../types";

/**
 * Compare a cart's total cost across multiple supermarkets.
 * Each store is queried in parallel; missing items are reported per-store.
 */
export async function compareCart(
  items: CartItem[],
  supermarkets: SupermarketId[] = ALL_SUPERMARKET_IDS,
): Promise<CartComparison> {
  const eans = items.map((i) => i.ean ?? i.productKey).filter(Boolean);

  const perStore = await Promise.all(
    supermarkets.map(async (id) => {
      const res = await getAdapter(id).getOffersByEan(eans);
      const offers = res.ok ? res.data : [];
      return buildStoreTotal(id, items, offers);
    }),
  );

  const totals = perStore.sort((a, b) => a.subtotal - b.subtotal);
  const cheapest = totals[0];
  const mostExpensive = totals[totals.length - 1];
  const potentialSavings =
    cheapest && mostExpensive && mostExpensive.subtotal > 0
      ? {
          amount: mostExpensive.subtotal - cheapest.subtotal,
          percent: +(((mostExpensive.subtotal - cheapest.subtotal) / mostExpensive.subtotal) * 100).toFixed(2),
        }
      : undefined;

  return { totals, cheapest, mostExpensive, potentialSavings };
}

function buildStoreTotal(
  storeId: SupermarketId,
  items: CartItem[],
  offers: ProductOffer[],
): StoreCartTotal {
  const byEan = new Map(offers.map((o) => [o.ean ?? o.id, o]));
  const matched: StoreCartTotal["matchedItems"] = [];
  const missing: StoreCartTotal["missingItems"] = [];

  for (const item of items) {
    const key = item.ean ?? item.productKey;
    const offer = byEan.get(key);
    if (offer && offer.inStock) {
      matched.push({
        productKey: item.productKey,
        name: item.name,
        quantity: item.quantity,
        unitPrice: offer.price,
        lineTotal: offer.price * item.quantity,
      });
    } else {
      missing.push({ productKey: item.productKey, name: item.name, quantity: item.quantity });
    }
  }

  const subtotal = matched.reduce((sum, l) => sum + l.lineTotal, 0);
  const coverage = items.length === 0 ? 1 : matched.length / items.length;

  return {
    supermarketId: storeId,
    supermarketName: SUPERMARKETS[storeId].name,
    subtotal,
    matchedItems: matched,
    missingItems: missing,
    coverage,
    observedAt: new Date().toISOString(),
  };
}
