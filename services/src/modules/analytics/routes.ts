import { FastifyInstance } from 'fastify';
export default async function (app: FastifyInstance){
  app.addHook('preHandler', app.authenticate);
  app.post('/analytics/track', async (req: any) => {
    const { name, props } = req.body as any; await app.prisma.analyticsEvent.create({ data: { name, props, userId: req.user.sub } });
    return { ok: true };
  });
}
