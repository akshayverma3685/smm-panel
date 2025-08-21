import { FastifyInstance } from 'fastify';
import { prisma } from '../../prisma';

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);
  app.get('/me/subscription', async (req: any) => {
    const userId = req.user.sub as string;
    return prisma.subscription.findUnique({ where: { userId }, include: { plan: true } });
  });
}
