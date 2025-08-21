import Razorpay from 'razorpay';
import { env } from '../../env';
import { prisma } from '../../prisma';

const razor = new Razorpay({ key_id: env.RAZORPAY_KEY_ID!, key_secret: env.RAZORPAY_KEY_SECRET! });

export async function createRazorpayOrder(userId: string, planId: string){
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error('plan not found');
  const order = await razor.orders.create({ amount: plan.pricePaise, currency: plan.currency, notes: { userId, planId, type: 'subscription-first' } });
  return { orderId: order.id, amount: order.amount, currency: order.currency };
}
