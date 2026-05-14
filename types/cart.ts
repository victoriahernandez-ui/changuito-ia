export interface CartLine {
  productId: number;
  quantity: number;
}

export interface StoreComparison {
  store: string;
  total: number;
  savings: number;
  isCheapest: boolean;
}
