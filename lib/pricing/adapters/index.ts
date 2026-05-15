import type { SupermarketId } from "../types";
import type { SupermarketAdapter } from "./types";
import { createMockAdapter } from "./mock-adapter";

/**
 * Adapter registry. Today every store points at the mock adapter.
 * To wire a real API later, replace one entry with a real HTTP adapter,
 * e.g. `carrefour: createCarrefourAdapter({ baseUrl, apiKey })`.
 * The service layer and UI need NO changes.
 */
const registry: Record<SupermarketId, SupermarketAdapter> = {
  carrefour: createMockAdapter("carrefour"),
  coto:      createMockAdapter("coto"),
  jumbo:     createMockAdapter("jumbo"),
  disco:     createMockAdapter("disco"),
  dia:       createMockAdapter("dia"),
};

export function getAdapter(id: SupermarketId): SupermarketAdapter {
  return registry[id];
}

export function getAllAdapters(): SupermarketAdapter[] {
  return Object.values(registry);
}

export type { SupermarketAdapter } from "./types";
