import Stripe from 'stripe';
import { env } from '../../env';
import { prisma } from '../../prisma';

export const stripe = new Stripe(env.STRIPE_SECRET!, { apiVersion: '2024-06-20' as any });

export async function createStripeCheckout(userId: string, planId: string) {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error('plan not found');
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    success_url: `${env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/billing/cancel`,
    line_items: [{ price_data: { currency: plan.currency.toLowerCase(), product_data: { name: plan.name }, recurring: { interval: plan.interval as any }, unit_amount: plan.pricePaise }, quantity: 1 }],
    metadata: { userId, planId }
  });
  return { url: session.url! };
}
