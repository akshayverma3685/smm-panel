import { FastifyInstance } from 'fastify';
export default async function (app: FastifyInstance){
  app.addHook('preHandler', app.authenticate);
  app.get('/admin/audit-logs', { preHandler: [app.authorize(['ADMIN'])] }, async () => {
    return app.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  });
}
