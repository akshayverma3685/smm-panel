import { FastifyInstance } from 'fastify';
import { verifySignature } from './webhook';

export default async function (app: FastifyInstance){
  app.post('/webhooks/payments', { config: { rawBody: true } }, async (req: any, reply) => {
    const sig = req.headers['x-signature'] as string|undefined;
    const raw = (req as any).rawBody || JSON.stringify(req.body||{});
    if (!verifySignature(raw, sig)) return reply.unauthorized('invalid signature');

    await app.prisma.webhookLog.create({ data: { provider: 'payments', payload: req.body } });
    // TODO: map event -> credit wallet, update payment rows, etc.
    return { received: true };
  });
}
