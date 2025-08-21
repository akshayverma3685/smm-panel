import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { env } from '../env';

export default fp(async (app) => {
  await app.register(jwt, { secret: env.JWT_SECRET, sign: { expiresIn: env.JWT_EXPIRES_IN } });
  app.decorate('authenticate', async function (request: any, reply: any) {
    try { await request.jwtVerify(); } catch { return reply.code(401).send({ message: 'Unauthorized' }); }
  });
});
