export type PaymentMethod = 'all' | 'Credit Card' | 'Debit Card' | 'QR' | 'Installments';

export interface BankPromotion {
  store: string;
  bank: string;
  paymentMethod: Exclude<PaymentMethod, 'all'>;
  discountPercent: number;
  maxDiscount: number;
}

export const bankPromotions: BankPromotion[] = [
  { store: 'Carrefour', bank: 'Visa', paymentMethod: 'Credit Card', discountPercent: 10, maxDiscount: 700 },
  { store: 'Carrefour', bank: 'Mastercard', paymentMethod: 'Debit Card', discountPercent: 5, maxDiscount: 300 },
  { store: 'Carrefour', bank: 'Naranja', paymentMethod: 'QR', discountPercent: 12, maxDiscount: 500 },
  { store: 'Coto', bank: 'American Express', paymentMethod: 'Credit Card', discountPercent: 15, maxDiscount: 900 },
  { store: 'Coto', bank: 'Visa', paymentMethod: 'Debit Card', discountPercent: 8, maxDiscount: 400 },
  { store: 'Coto', bank: 'Naranja', paymentMethod: 'Credit Card', discountPercent: 10, maxDiscount: 500 },
  { store: 'Día', bank: 'Naranja', paymentMethod: 'Credit Card', discountPercent: 8, maxDiscount: 450 },
  { store: 'Día', bank: 'Mastercard', paymentMethod: 'Debit Card', discountPercent: 6, maxDiscount: 320 },
  { store: 'Día', bank: 'Visa', paymentMethod: 'QR', discountPercent: 10, maxDiscount: 380 },
  { store: 'Disco', bank: 'Visa', paymentMethod: 'Credit Card', discountPercent: 12, maxDiscount: 680 },
  { store: 'Disco', bank: 'Mastercard', paymentMethod: 'Debit Card', discountPercent: 7, maxDiscount: 360 },
  { store: 'Jumbo', bank: 'Naranja', paymentMethod: 'Credit Card', discountPercent: 14, maxDiscount: 760 },
  { store: 'Jumbo', bank: 'Visa', paymentMethod: 'QR', discountPercent: 9, maxDiscount: 420 },
  { store: 'Walmart', bank: 'Mastercard', paymentMethod: 'Credit Card', discountPercent: 10, maxDiscount: 650 },
  { store: 'Walmart', bank: 'Visa', paymentMethod: 'Debit Card', discountPercent: 5, maxDiscount: 280 },
  { store: 'Walmart', bank: 'Naranja', paymentMethod: 'QR', discountPercent: 11, maxDiscount: 490 },
];