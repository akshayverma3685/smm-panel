import { FastifyInstance } from 'fastify';
export default async function (app: FastifyInstance){
  app.addHook('preHandler', app.authenticate);
  app.get('/me', async (req: any) => {
    return app.prisma.user.findUnique({ where: { id: req.user.sub }, select: { id: true, email: true, role: true } });
  });
}
