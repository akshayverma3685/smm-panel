import { z } from 'zod';
export const createOrderSchema = z.object({ serviceId: z.string().cuid(), quantity: z.number().int().min(1), targetUrl: z.string().url() });
