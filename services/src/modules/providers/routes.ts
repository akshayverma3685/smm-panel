import { FastifyInstance } from 'fastify';
export default async function (app: FastifyInstance){
  app.addHook('preHandler', app.authenticate);
  app.get('/providers', { preHandler: [app.authorize(['ADMIN'])] }, async () => {
    return app.prisma.provider.findMany({ include: { mappings: true } });
  });
}
