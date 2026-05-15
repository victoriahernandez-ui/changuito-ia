import { NextResponse } from 'next/server';
import { bankPromotions, type BankPromotion } from '@/data/bankPromotions';

export const dynamic = 'force-dynamic';

const MOCK_BANK_PROMOTIONS: BankPromotion[] = [
  { store: 'Carrefour', bank: 'Banco Nacion', paymentMethod: 'Credit Card', discountPercent: 20, maxDiscount: 6000 },
  { store: 'Carrefour', bank: 'Banco Galicia', paymentMethod: 'Debit Card', discountPercent: 15, maxDiscount: 4500 },
  { store: 'Carrefour', bank: 'Modo', paymentMethod: 'QR', discountPercent: 25, maxDiscount: 5000 },
  { store: 'Coto', bank: 'Banco Ciudad', paymentMethod: 'Credit Card', discountPercent: 20, maxDiscount: 7000 },
  { store: 'Coto', bank: 'Banco Macro', paymentMethod: 'Debit Card', discountPercent: 10, maxDiscount: 3000 },
  { store: 'Coto', bank: 'Modo', paymentMethod: 'QR', discountPercent: 20, maxDiscount: 5000 },
  { store: 'Día', bank: 'Cuenta DNI', paymentMethod: 'QR', discountPercent: 30, maxDiscount: 5500 },
  { store: 'Día', bank: 'Banco Provincia', paymentMethod: 'Debit Card', discountPercent: 20, maxDiscount: 4500 },
  { store: 'Disco', bank: 'Banco Santander', paymentMethod: 'Credit Card', discountPercent: 15, maxDiscount: 6000 },
  { store: 'Disco', bank: 'Modo', paymentMethod: 'QR', discountPercent: 20, maxDiscount: 4500 },
  { store: 'Jumbo', bank: 'Banco Santander', paymentMethod: 'Credit Card', discountPercent: 15, maxDiscount: 6000 },
  { store: 'Jumbo', bank: 'Banco Galicia', paymentMethod: 'Debit Card', discountPercent: 10, maxDiscount: 4000 },
  { store: 'Vea', bank: 'Banco Galicia', paymentMethod: 'Credit Card', discountPercent: 20, maxDiscount: 5000 },
  { store: 'ChangoMas', bank: 'Naranja X', paymentMethod: 'QR', discountPercent: 20, maxDiscount: 4500 },
];

export async function GET() {
  return NextResponse.json({
    source: 'mock',
    updatedAt: new Date().toISOString(),
    promotions: MOCK_BANK_PROMOTIONS.length ? MOCK_BANK_PROMOTIONS : bankPromotions,
  });
}
