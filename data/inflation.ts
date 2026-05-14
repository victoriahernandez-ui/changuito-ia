export interface InflationPoint {
  month: string;
  value: number;
}

export interface CategoryInflationPoint extends InflationPoint {
  category: string;
}

export const inflationHistory: InflationPoint[] = [
  { month: '2025-06', value: 158 },
  { month: '2025-07', value: 162 },
  { month: '2025-08', value: 171 },
  { month: '2025-09', value: 176 },
  { month: '2025-10', value: 182 },
  { month: '2025-11', value: 188 },
  { month: '2025-12', value: 192 },
  { month: '2026-01', value: 198 },
  { month: '2026-02', value: 205 },
  { month: '2026-03', value: 213 },
  { month: '2026-04', value: 220 },
  { month: '2026-05', value: 227 },
];

export const categoryInflation: CategoryInflationPoint[] = [
  { month: '2026-05', value: 18.4, category: 'Lácteos' },
  { month: '2026-05', value: 16.2, category: 'Almacén' },
  { month: '2026-05', value: 15.7, category: 'Bebidas' },
  { month: '2026-05', value: 17.9, category: 'Limpieza' },
  { month: '2026-05', value: 13.5, category: 'Snacks' },
  { month: '2026-05', value: 14.8, category: 'Congelados' },
  { month: '2026-05', value: 12.6, category: 'Perfumería' },
];
