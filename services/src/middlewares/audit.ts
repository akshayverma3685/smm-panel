import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.addHook('onResponse', async (req, reply) => {
    try {
      const actor = (req as any).user;
      await app.prisma.auditLog.create({ data: {
        actorId: actor?.sub, actorEmail: actor?.email,
        ip: req.ip, action: `${req.method} ${req.url}`,
        resource: req.params ? JSON.stringify(req.params) : undefined,
        details: { statusCode: reply.statusCode }
      }});
    } catch {}
  });
});
