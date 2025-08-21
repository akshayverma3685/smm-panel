import { FastifyInstance } from 'fastify';
import { stripe } from './stripe';
import { env } from '../../env';
import crypto from 'crypto';
import { prisma } from '../../prisma';

export default async function (app: FastifyInstance) {
  // Stripe webhook
  app.post('/billing/webhook/stripe', { config: { rawBody: true } }, async (req: any, reply) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      return reply.code(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session: any = event.data.object;
      const userId = session.metadata.userId; const planId = session.metadata.planId;
      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) return reply.code(400).send('plan missing');
      const now = new Date();
      const next = new Date(now);
      next.setMonth(next.getMonth() + (plan.interval === 'year' ? 12 : 1));

      await prisma.subscription.upsert({
        where: { userId },
        update: { planId, status: 'ACTIVE', provider: 'stripe', providerSubId: session.subscription, currentPeriodStart: now, currentPeriodEnd: next },
        create: { userId, planId, status: 'ACTIVE', provider: 'stripe', providerSubId: session.subscription, currentPeriodStart: now, currentPeriodEnd: next }
      });
      await prisma.invoice.create({ data: { subscriptionId: (await prisma.subscription.findUnique({ where: { userId } }))!.id, amountPaise: plan.pricePaise, provider: 'stripe', status: 'PAID', providerInvoiceId: session.id } });
    }

    reply.send({ received: true });
  });

  // Razorpay webhook
  app.post('/billing/webhook/razorpay', { config: { rawBody: true } }, async (req: any, reply) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const secret = env.RAZORPAY_KEY_SECRET!;
    const expected = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
    if (expected !== signature) return reply.code(400).send('invalid signature');

    const evt = JSON.parse(req.rawBody);
    if (evt.event === 'payment.captured') {
      const notes = evt.payload.payment.entity.notes || {};
      const userId = notes.userId as string; const planId = notes.planId as string;
      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) return reply.code(400).send('plan missing');
      const now = new Date(); const next = new Date(now);
      next.setMonth(next.getMonth() + (plan.interval === 'year' ? 12 : 1));

      await prisma.subscription.upsert({
        where: { userId },
        update: { planId, status: 'ACTIVE', provider: 'razorpay', currentPeriodStart: now, currentPeriodEnd: next },
        create: { userId, planId, status: 'ACTIVE', provider: 'razorpay', currentPeriodStart: now, currentPeriodEnd: next }
      });
      const sub = await prisma.subscription.findUnique({ where: { userId } });
      await prisma.invoice.create({ data: { subscriptionId: sub!.id, amountPaise: plan.pricePaise, provider: 'razorpay', status: 'PAID', providerInvoiceId: evt.payload.payment.entity.id } });
    }

    reply.send({ ok: true });
  });
        }
