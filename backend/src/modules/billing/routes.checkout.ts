import { FastifyInstance } from 'fastify';
import { createStripeCheckout } from './stripe';
import { createRazorpayOrder } from './razorpay';

export default async function (app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate);

  app.post('/billing/checkout', async (req: any, reply) => {
    const { provider, planId } = req.body as any;
    const userId = req.user.sub as string;
    if (provider === 'stripe') return createStripeCheckout(userId, planId);
    if (provider === 'razorpay') return createRazorpayOrder(userId, planId);
    return reply.badRequest('unknown provider');
  });
}
