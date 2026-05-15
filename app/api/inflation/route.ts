import { NextResponse } from 'next/server';
import { inflationData, smartCartIndex, type InflationData } from '@/data/inflationData';

const INDEC_IPC_MONTHLY_VARIATION_ID = '145.3_INGNACUAL_DICI_M_38';
const SERIES_API_URL = 'https://apis.datos.gob.ar/series/api/series/';
const FETCH_TIMEOUT_MS = 8000;

export const dynamic = 'force-dynamic';

interface SeriesApiResponse {
  data?: Array<[string, number | null]>;
}

const fetchOfficialInflation = async (months: number) => {
  const url = new URL(SERIES_API_URL);
  url.searchParams.set('ids', INDEC_IPC_MONTHLY_VARIATION_ID);
  url.searchParams.set('limit', String(months));
  url.searchParams.set('sort', 'desc');
  url.searchParams.set('format', 'json');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 60 * 60 * 12 },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as SeriesApiResponse;
    const rows = Array.isArray(payload.data) ? payload.data : [];

    return rows
      .filter((row): row is [string, number] => typeof row[0] === 'string' && typeof row[1] === 'number')
      .reverse();
  } catch (error) {
    console.error('INDEC inflation request failed:', error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
};

const buildOfficialData = (rows: Array<[string, number]>): InflationData[] => {
  return rows.map(([date, monthlyVariation], index) => {
    const month = date.slice(0, 7);
    const fallback = inflationData.find((item) => item.month === month) ?? inflationData[index] ?? inflationData[0];

    return {
      month,
      inflation: Number((monthlyVariation * 100).toFixed(2)),
      categoryInflation: fallback?.categoryInflation ?? {},
      topIncreases: fallback?.topIncreases ?? [],
    };
  });
};

const buildOfficialIndex = (data: InflationData[]) => {
  const firstIndex = smartCartIndex[0]?.index ?? 1000;
  let runningIndex = firstIndex;

  return data.map((item, index) => {
    if (index > 0) {
      runningIndex *= 1 + item.inflation / 100;
    }

    return {
      month: item.month,
      index: Math.round(runningIndex),
      date: new Date(`${item.month}-01`).toISOString(),
    };
  });
};

export async function GET(request: Request) {
  const monthsParam = Number(new URL(request.url).searchParams.get('months'));
  const months = Number.isFinite(monthsParam) ? Math.min(Math.max(monthsParam, 3), 24) : 12;
  const officialRows = await fetchOfficialInflation(months);
  const officialInflationData = officialRows?.length ? buildOfficialData(officialRows) : null;
  const data = officialInflationData ?? inflationData.slice(-months);

  return NextResponse.json({
    source: officialInflationData ? 'indec-series-api' : 'mock',
    updatedAt: new Date().toISOString(),
    data,
    smartCartIndex: officialInflationData ? buildOfficialIndex(data) : smartCartIndex.slice(-data.length),
  });
}
