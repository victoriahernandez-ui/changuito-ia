import { NextResponse } from 'next/server';

const PRECIOS_CLAROS_API_URL = 'https://d3e6htiiul5ek9.cloudfront.net/prod';
const DEFAULT_LAT = '-34.6037';
const DEFAULT_LNG = '-58.3816';
const DEFAULT_BRANCH_LIMIT = 30;
const DEFAULT_PRODUCT_LIMIT = 12;
const FETCH_TIMEOUT_MS = 8000;

interface PreciosClarosBranch {
  id: string;
  banderaDescripcion?: string;
  comercioRazonSocial?: string;
  direccion?: string;
  localidad?: string;
}

interface PreciosClarosProduct {
  id: string;
  nombre?: string;
  marca?: string;
  presentacion?: string;
  precioMin?: number;
  precioMax?: number;
}

interface PreciosClarosProductBranch {
  id: string;
  banderaDescripcion?: string;
  comercioRazonSocial?: string;
  direccion?: string;
  sucursalNombre?: string;
  preciosProducto?: {
    precioLista?: number | string;
    promo1?: { precio?: number | string };
    promo2?: { precio?: number | string };
  };
}

interface AppPriceEntry {
  store: string;
  price: number;
  discountPercent?: number;
}

interface AppProduct {
  id: number;
  name: string;
  category: string;
  brand: string;
  description: string;
  rating: number;
  isOnOffer: boolean;
  freeShipping: boolean;
  prices: AppPriceEntry[];
}

export const dynamic = 'force-dynamic';

const toNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const roundPrice = (value: number) => Math.round(value * 100) / 100;

const getSearchParam = (request: Request, name: string, fallback: string) => {
  const value = new URL(request.url).searchParams.get(name)?.trim();
  return value || fallback;
};

const getBranchName = (branch: PreciosClarosProductBranch | PreciosClarosBranch) => {
  const storeName = branch.banderaDescripcion || branch.comercioRazonSocial || 'Supermercado';

  const normalized = storeName
    .replace(/\s+CICSA$/i, '')
    .replace(/\s+S\.?A\.?.*$/i, '')
    .trim();

  const knownStores: Array<[RegExp, string]> = [
    [/carrefour/i, 'Carrefour'],
    [/\bcoto\b/i, 'Coto'],
    [/\bd[ií]a\b/i, 'Día'],
    [/\bdisco\b/i, 'Disco'],
    [/\bjumbo\b/i, 'Jumbo'],
    [/\bvea\b/i, 'Vea'],
    [/changomas|chango mas/i, 'ChangoMas'],
    [/farmacity/i, 'Farmacity'],
  ];

  return knownStores.find(([pattern]) => pattern.test(normalized))?.[1] ?? normalized;
};

const fetchJson = async <T,>(url: URL): Promise<T | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent': 'smartcart-ar/0.1 (+https://preciosclaros.gob.ar)',
      },
      next: { revalidate: 60 * 15 },
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('Precios Claros API error', response.status, url.toString());
      return null;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error('Precios Claros request failed', url.toString(), error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
};

async function getNearbyBranchIds(lat: string, lng: string, limit: number) {
  const url = new URL(`${PRECIOS_CLAROS_API_URL}/sucursales`);
  url.searchParams.set('lat', lat);
  url.searchParams.set('lng', lng);
  url.searchParams.set('limit', String(limit));

  const data = await fetchJson<{ sucursales?: PreciosClarosBranch[] }>(url);
  const branches = Array.isArray(data?.sucursales) ? data.sucursales : [];

  return branches
    .map((branch) => branch.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
}

async function searchProducts(query: string, branchIds: string[], limit: number) {
  const url = new URL(`${PRECIOS_CLAROS_API_URL}/productos`);
  url.searchParams.set('string', query);
  url.searchParams.set('array_sucursales', branchIds.join(','));
  url.searchParams.set('offset', '0');
  url.searchParams.set('limit', String(limit));

  const data = await fetchJson<{ productos?: PreciosClarosProduct[] }>(url);
  return Array.isArray(data?.productos) ? data.productos : [];
}

async function getProductPrices(productId: string, branchIds: string[]) {
  const url = new URL(`${PRECIOS_CLAROS_API_URL}/producto`);
  url.searchParams.set('limit', '30');
  url.searchParams.set('id_producto', productId);
  url.searchParams.set('array_sucursales', branchIds.join(','));

  const data = await fetchJson<{ sucursales?: PreciosClarosProductBranch[] }>(url);
  const branches = Array.isArray(data?.sucursales) ? data.sucursales : [];

  const branchPrices = branches
    .map((branch) => {
      const listPrice = toNumber(branch.preciosProducto?.precioLista);
      const promo1 = toNumber(branch.preciosProducto?.promo1?.precio);
      const promo2 = toNumber(branch.preciosProducto?.promo2?.precio);
      const validPrices = [listPrice, promo1, promo2].filter(
        (price): price is number => typeof price === 'number' && price > 0
      );

      if (!validPrices.length) {
        return null;
      }

      const bestPrice = Math.min(...validPrices);
      const discountPercent =
        listPrice && bestPrice < listPrice ? Math.round(((listPrice - bestPrice) / listPrice) * 100) : undefined;

      const priceEntry: AppPriceEntry = {
        store: getBranchName(branch),
        price: roundPrice(bestPrice),
      };

      if (typeof discountPercent === 'number') {
        priceEntry.discountPercent = discountPercent;
      }

      return priceEntry;
    })
    .filter((price): price is AppPriceEntry => price !== null);

  return Array.from(
    branchPrices
      .reduce((stores, price) => {
        const current = stores.get(price.store);
        if (!current || price.price < current.price) {
          stores.set(price.store, price);
        }
        return stores;
      }, new Map<string, AppPriceEntry>())
      .values()
  )
    .sort((a, b) => a.price - b.price);
}

async function normalizeProduct(
  product: PreciosClarosProduct,
  index: number,
  branchIds: string[]
): Promise<AppProduct | null> {
  const prices = await getProductPrices(product.id, branchIds);
  const fallbackMinPrice = toNumber(product.precioMin);
  const fallbackMaxPrice = toNumber(product.precioMax);
  const fallbackPrices: AppPriceEntry[] =
    fallbackMinPrice && fallbackMaxPrice
      ? [
          { store: 'Precios Claros - menor precio cercano', price: roundPrice(fallbackMinPrice) },
          { store: 'Precios Claros - mayor precio cercano', price: roundPrice(fallbackMaxPrice) },
        ]
      : [];

  const normalizedPrices = prices.length ? prices : fallbackPrices;

  if (!normalizedPrices.length) {
    return null;
  }

  const numericId = Number(product.id);
  const name = product.nombre || product.marca || 'Producto sin nombre';
  const brand = product.marca || 'Sin marca';
  const presentation = product.presentacion ? ` - ${product.presentacion}` : '';

  return {
    id: Number.isSafeInteger(numericId) ? numericId : 900000 + index,
    name,
    category: product.presentacion || 'Supermercado',
    brand,
    description: `${brand}${presentation}`,
    rating: 0,
    isOnOffer: normalizedPrices.some((price) => typeof price.discountPercent === 'number'),
    freeShipping: false,
    prices: normalizedPrices,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json([]);
  }

  const lat = getSearchParam(request, 'lat', DEFAULT_LAT);
  const lng = getSearchParam(request, 'lng', DEFAULT_LNG);
  const branchLimit = Math.min(Number(searchParams.get('branchLimit')) || DEFAULT_BRANCH_LIMIT, 50);
  const productLimit = Math.min(Number(searchParams.get('limit')) || DEFAULT_PRODUCT_LIMIT, 20);

  try {
    const branchIds = await getNearbyBranchIds(lat, lng, branchLimit);

    if (!branchIds.length) {
      return NextResponse.json([]);
    }

    const products = await searchProducts(query, branchIds, productLimit);
    const normalizedProducts = await Promise.all(
      products.map((product, index) => normalizeProduct(product, index, branchIds))
    );

    return NextResponse.json(normalizedProducts.filter((product): product is AppProduct => product !== null));
  } catch (error) {
    console.error('products route error:', error);
    return NextResponse.json([]);
  }
}
