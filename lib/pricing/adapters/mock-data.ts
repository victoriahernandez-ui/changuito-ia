import type { ProductOffer, SupermarketId } from "../types";

/**
 * Tiny seeded catalogue used by the mock adapters.
 * Real adapters will replace this with live HTTP calls.
 */

interface SeedProduct {
  ean: string;
  name: string;
  brand: string;
  category: string;
  /** Approximate ARS price; per-store variance is added in the adapter. */
  basePrice: number;
  unit?: { value: number; unit: string };
}

export const SEED_PRODUCTS: SeedProduct[] = [
  { ean: "7790070410016", name: "Leche entera La Serenísima 1L",     brand: "La Serenísima", category: "Lácteos",   basePrice: 1850, unit: { value: 1850, unit: "$/L"  } },
  { ean: "7790580121006", name: "Aceite de girasol Natura 900ml",   brand: "Natura",         category: "Almacén",   basePrice: 3200, unit: { value: 3555, unit: "$/L"  } },
  { ean: "7790040001019", name: "Yerba mate Taragüí 1kg",           brand: "Taragüí",        category: "Almacén",   basePrice: 4900, unit: { value: 4900, unit: "$/kg" } },
  { ean: "7790070800015", name: "Pan lactal Bimbo 540g",            brand: "Bimbo",          category: "Panificados", basePrice: 2750, unit: { value: 5092, unit: "$/kg" } },
  { ean: "7791290000017", name: "Fideos Matarazzo Spaghetti 500g",  brand: "Matarazzo",      category: "Almacén",   basePrice: 1250, unit: { value: 2500, unit: "$/kg" } },
  { ean: "7790895000018", name: "Coca-Cola 2.25L",                  brand: "Coca-Cola",      category: "Bebidas",   basePrice: 3100, unit: { value: 1377, unit: "$/L"  } },
  { ean: "7790580000019", name: "Arroz largo fino Gallo 1kg",       brand: "Gallo",          category: "Almacén",   basePrice: 2450, unit: { value: 2450, unit: "$/kg" } },
  { ean: "7790010000020", name: "Azúcar Ledesma 1kg",               brand: "Ledesma",        category: "Almacén",   basePrice: 1750, unit: { value: 1750, unit: "$/kg" } },
];

/**
 * Per-store price multipliers (purely for mock realism).
 * Día tends to be cheapest, Jumbo/Disco premium.
 */
const STORE_MULTIPLIER: Record<SupermarketId, number> = {
  dia: 0.93,
  carrefour: 0.98,
  coto: 1.02,
  disco: 1.06,
  jumbo: 1.08,
};

const STORE_NOISE_SEED: Record<SupermarketId, number> = {
  carrefour: 11,
  coto: 23,
  jumbo: 37,
  disco: 41,
  dia: 53,
};

/** Deterministic pseudo-noise so prices are stable across reloads. */
function noise(ean: string, store: SupermarketId): number {
  const seed = STORE_NOISE_SEED[store];
  let h = 0;
  for (let i = 0; i < ean.length; i++) h = (h * 31 + ean.charCodeAt(i)) >>> 0;
  const n = ((h ^ seed) % 1000) / 1000; // 0..1
  return 0.96 + n * 0.08; // ±4%
}

export function buildOffer(seed: SeedProduct, store: SupermarketId): ProductOffer {
  const price = Math.round(seed.basePrice * STORE_MULTIPLIER[store] * noise(seed.ean, store));
  const hasDiscount = (price + STORE_NOISE_SEED[store]) % 4 === 0;
  return {
    id: `${store}-${seed.ean}`,
    supermarketId: store,
    ean: seed.ean,
    name: seed.name,
    brand: seed.brand,
    category: seed.category,
    price,
    listPrice: hasDiscount ? Math.round(price * 1.15) : undefined,
    pricePerUnit: seed.unit
      ? { value: Math.round(seed.unit.value * STORE_MULTIPLIER[store]), unit: seed.unit.unit }
      : undefined,
    observedAt: new Date().toISOString(),
    inStock: noise(seed.ean, store) > 0.97 ? false : true,
    url: `https://example.com/${store}/p/${seed.ean}`,
  };
}

export function findSeedByEan(ean: string): SeedProduct | undefined {
  return SEED_PRODUCTS.find((p) => p.ean === ean);
}

export function searchSeeds(q: string): SeedProduct[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return SEED_PRODUCTS;
  return SEED_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(needle) ||
      p.brand.toLowerCase().includes(needle) ||
      p.category.toLowerCase().includes(needle),
  );
}
