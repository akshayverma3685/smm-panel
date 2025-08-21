import { z } from 'zod';
export const idParam = z.object({ id: z.string().cuid() });
export const paginationQuery = z.object({ page: z.coerce.number().min(1).default(1), pageSize: z.coerce.number().min(1).max(100).default(20) });
