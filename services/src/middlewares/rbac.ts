import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.decorate('authorize', (roles: Array<'ADMIN'|'USER'|'RESELLER'>) => {
    return async function (req: any, reply: any) {
      const user = req.user;
      if (!user || !roles.includes(user.role)) return reply.forbidden('forbidden');
    };
  });
});
