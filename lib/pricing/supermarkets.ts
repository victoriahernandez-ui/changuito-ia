import type { Supermarket, SupermarketId } from "./types";

export const SUPERMARKETS: Record<SupermarketId, Supermarket> = {
  carrefour: { id: "carrefour", name: "Carrefour", country: "AR" },
  coto:      { id: "coto",      name: "Coto",      country: "AR" },
  jumbo:     { id: "jumbo",     name: "Jumbo",     country: "AR" },
  disco:     { id: "disco",     name: "Disco",     country: "AR" },
  dia:       { id: "dia",       name: "Día",       country: "AR" },
};

export const ALL_SUPERMARKET_IDS: SupermarketId[] = [
  "carrefour",
  "coto",
  "jumbo",
  "disco",
  "dia",
];
