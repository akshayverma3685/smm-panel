import { FastifyInstance } from 'fastify';
import { createOrderSchema } from '../../schemas/orders';
import { callProvider } from '../providers/router';

export default async function (app: FastifyInstance){
  app.addHook('preHandler', app.authenticate);

  app.get('/orders', async (req: any) => {
    return app.prisma.order.findMany({ where: { userId: req.user.sub }, orderBy: { createdAt: 'desc' }, include: { service: true } });
  });

  app.post('/orders', async (req: any, reply) => {
    const body = createOrderSchema.parse(req.body);
    const userId = req.user.sub as string;
    const svc = await app.prisma.service.findUnique({ where: { id: body.serviceId }, include: { providerMappings: { include: { provider: true } } } });
    if (!svc || !svc.isActive) return reply.badRequest('invalid service');
    if (body.quantity < svc.minQty || body.quantity > svc.maxQty) return reply.badRequest('invalid quantity');

    const cost = svc.basePrice * body.quantity; // paise
    const wallet = await app.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < cost) return reply.paymentRequired('insufficient balance');

    const order = await app.prisma.$transaction(async (tx) => {
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: cost }, txns: { create: { amount: -cost, reason: 'order' } } } });
      return tx.order.create({ data: { userId, serviceId: svc.id, quantity: body.quantity, cost, targetUrl: body.targetUrl, status: 'QUEUED' } });
    });

    // route to provider
    try {
      const { externalOrderId, note } = await callProvider({ ...order, service: svc });
      await app.prisma.order.update({ where: { id: order.id }, data: { externalOrderId, statusNote: note, status: 'PROCESSING' } });
    } catch (e: any) {
      await app.prisma.order.update({ where: { id: order.id }, data: { status: 'FAILED', statusNote: String(e?.message||e) } });
    }

    return { id: order.id };
  });
        }
