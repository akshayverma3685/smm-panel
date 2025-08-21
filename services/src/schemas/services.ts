import { z } from 'zod';
export const createServiceSchema = z.object({ name: z.string().min(2), description: z.string().optional(), categoryName: z.string().min(2), basePrice: z.number().int().positive(), minQty: z.number().int().positive().default(10), maxQty: z.number().int().positive().default(10000) });
