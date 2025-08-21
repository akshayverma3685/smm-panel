import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';

export default async function (app: FastifyInstance) {
  app.get('/billing/plans', async () => prisma.plan.findMany({ where: { isActive: true }, orderBy: { pricePaise: 'asc' } }));

  app.post('/admin/billing/plans', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    if (req.user.role !== 'ADMIN') return reply.forbidden('admin only');
    const data = req.body as any;
    return prisma.plan.create({ data });
  });

  app.put('/admin/billing/plans/:id', { preHandler: [app.authenticate] }, async (req: any, reply) => {
    if (req.user.role !== 'ADMIN') return reply.forbidden('admin only');
    const { id } = req.params as any; const data = req.body as any;
    return prisma.plan.update({ where: { id }, data });
  });
}
