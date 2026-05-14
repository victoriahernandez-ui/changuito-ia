export interface PriceEntry {
  store: string;
  price: number;
  discountPercent?: number;
  freeShipping?: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  description: string;
  rating: number;
  isOnOffer: boolean;
  freeShipping: boolean;
  prices: PriceEntry[];
}
