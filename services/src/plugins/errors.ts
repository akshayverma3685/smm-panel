import fp from 'fastify-plugin';
import { logger } from '../logger';

export default fp(async (app) => {
  app.setErrorHandler((err, req, reply) => {
    logger.error({ err }, 'request_error');
    const status = (err as any).statusCode || 500;
    reply.code(status).send({ message: err.message || 'Internal Error' });
  });
});
