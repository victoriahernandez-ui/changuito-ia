export interface TrendTile {
  label: string;
  value: string;
  delta: string;
  accent: 'blue' | 'green' | 'purple' | 'red';
}

export interface HeatmapPoint {
  category: string;
  score: number;
}

export const trendTiles: TrendTile[] = [
  { label: 'Inflación anual', value: '227%', delta: '+4.1%', accent: 'red' },
  { label: 'Ahorro promedio', value: '32%', delta: '+1.7%', accent: 'green' },
  { label: 'Supermercado más barato', value: 'Día', delta: '-12%', accent: 'blue' },
  { label: 'Promos activas', value: '28', delta: '+8', accent: 'purple' },
];

export const heatmapData: HeatmapPoint[] = [
  { category: 'Lácteos', score: 85 },
  { category: 'Bebidas', score: 72 },
  { category: 'Limpieza', score: 90 },
  { category: 'Almacén', score: 60 },
  { category: 'Snacks', score: 55 },
  { category: 'Perfumería', score: 48 },
  { category: 'Congelados', score: 65 },
];
