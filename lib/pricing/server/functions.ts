import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { compareCart, getProductInflation, searchProducts } from "../services";
import { ALL_SUPERMARKET_IDS } from "../supermarkets";
import type { SupermarketId } from "../types";

const supermarketEnum = z.enum(ALL_SUPERMARKET_IDS as [SupermarketId, ...SupermarketId[]]);

export const searchProductsFn = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      q: z.string().min(1).max(120),
      supermarkets: z.array(supermarketEnum).optional(),
      category: z.string().max(60).optional(),
      limit: z.number().int().min(1).max(100).optional(),
      page: z.number().int().min(1).max(50).optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    return await searchProducts(data);
  });

export const compareCartFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      items: z
        .array(
          z.object({
            productKey: z.string().min(1).max(120),
            name: z.string().min(1).max(200),
            quantity: z.number().int().min(1).max(999),
            ean: z.string().max(20).optional(),
          }),
        )
        .min(1)
        .max(200),
      supermarkets: z.array(supermarketEnum).optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    return await compareCart(data.items, data.supermarkets);
  });

export const getInflationFn = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      productKey: z.string().min(1).max(120),
      months: z.number().int().min(1).max(36).optional(),
      supermarketId: supermarketEnum.optional(),
    }).parse,
  )
  .handler(async ({ data }) => {
    return await getProductInflation(data);
  });
