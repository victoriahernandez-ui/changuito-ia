export type SortOption =
  | 'cheapest'
  | 'bestRated'
  | 'priceAsc'
  | 'priceDesc'
  | 'relevance';

export interface Filters {
  categories: string[];
  stores: string[];
  minPrice: number;
  maxPrice: number;
  onlyOffers: boolean;
  onlyFreeShipping: boolean;
  sortBy: SortOption;
}

export interface SuggestionSection {
  title: string;
  items: string[];
}
