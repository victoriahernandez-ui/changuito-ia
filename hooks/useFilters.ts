'use client';

import { useMemo, useState } from 'react';
import { Filters } from '@/types/search';
import { Product } from '@/types/product';

export const defaultFilters: Filters = {
  categories: [],
  stores: [],
  minPrice: 0,
  maxPrice: 10000,
  onlyOffers: false,
  onlyFreeShipping: false,
  sortBy: 'relevance',
};

export function useFilters(products: Product[]) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  );

  const stores = useMemo(
    () => Array.from(new Set(products.flatMap((product) => product.prices.map((price) => price.store)))).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const hasCategory = !filters.categories.length || filters.categories.includes(product.category);
        const hasStore = !filters.stores.length || product.prices.some((price) => filters.stores.includes(price.store));
        const hasOffer = !filters.onlyOffers || product.isOnOffer;
        const hasShipping = !filters.onlyFreeShipping || product.freeShipping;
        const bestPrice = Math.min(...product.prices.map((price) => price.price));
        const inPriceRange = bestPrice >= filters.minPrice && bestPrice <= filters.maxPrice;

        return hasCategory && hasStore && hasOffer && hasShipping && inPriceRange;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'cheapest') {
          return (
            Math.min(...a.prices.map((price) => price.price)) -
            Math.min(...b.prices.map((price) => price.price))
          );
        }
        if (filters.sortBy === 'priceAsc') {
          return (
            Math.min(...a.prices.map((price) => price.price)) -
            Math.min(...b.prices.map((price) => price.price))
          );
        }
        if (filters.sortBy === 'priceDesc') {
          return (
            Math.min(...b.prices.map((price) => price.price)) -
            Math.min(...a.prices.map((price) => price.price))
          );
        }
        if (filters.sortBy === 'bestRated') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [filters, products]);

  return {
    filters,
    setFilters,
    filteredProducts,
    categories,
    stores,
  };
}
