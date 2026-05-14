'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Product } from '@/types/product';
import { SuggestionSection } from '@/types/search';

const STORAGE_KEY = 'smartcart-ar-search-history';
const popularQueries = ['Leche', 'Pan', 'Queso', 'Aceite', 'Coca Cola', 'Lavandina'];

export function useSearch(products: Product[]) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentSearches(Array.isArray(parsed) ? parsed : []);
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 240);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 220);
    return () => window.clearTimeout(timer);
  }, [debouncedQuery]);

  const addRecentSearch = useCallback((value: string) => {
    if (!value.trim()) return;
    setRecentSearches((current) => {
      const next = [value, ...current.filter((item) => item !== value)].slice(0, 6);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const suggestionSections: SuggestionSection[] = useMemo(() => {
    const queryLower = query.toLowerCase();
    const names = Array.from(new Set(products.map((product) => product.name))).filter((name) =>
      name.toLowerCase().includes(queryLower)
    );
    const brands = Array.from(new Set(products.map((product) => product.brand))).filter((brand) =>
      brand.toLowerCase().includes(queryLower)
    );
    const categories = Array.from(new Set(products.map((product) => product.category))).filter((category) =>
      category.toLowerCase().includes(queryLower)
    );
    const stores = Array.from(
      new Set(products.flatMap((product) => product.prices.map((price) => price.store)))
    ).filter((store) => store.toLowerCase().includes(queryLower));

    return [
      { title: 'Productos', items: names.slice(0, 4) },
      { title: 'Marcas', items: brands.slice(0, 4) },
      { title: 'Categorías', items: categories.slice(0, 4) },
      { title: 'Supermercados', items: stores.slice(0, 4) },
    ];
  }, [products, query]);

  const filteredProducts = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter((product) => {
      const storeMatch = product.prices.some((price) =>
        price.store.toLowerCase().includes(normalized)
      );
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.brand.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized) ||
        storeMatch
      );
    });
  }, [debouncedQuery, products]);

  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const pickSuggestion = useCallback(
    (value: string) => {
      setQuery(value);
      addRecentSearch(value);
    },
    [addRecentSearch]
  );

  return {
    query,
    setQuery,
    filteredProducts,
    isLoading,
    recentSearches,
    popularQueries,
    suggestionSections,
    clearHistory,
    pickSuggestion,
    debouncedQuery,
  };
}
