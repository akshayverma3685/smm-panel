import Fastify from 'fastify';
import { logger } from './logger';
import security from './plugins/security';
import jwt from './plugins/jwt';
import prismaPlugin from './plugins/prisma';
import errors from './plugins/errors';
import rbac from './middlewares/rbac';
import audit from './middlewares/audit';

import healthRoutes from './modules/health/routes';
import authRoutes from './modules/auth/routes';
import userRoutes from './modules/users/routes';
import serviceRoutes from './modules/services/routes';
import orderRoutes from './modules/orders/routes';
import providerRoutes from './modules/providers/routes';
import paymentRoutes from './modules/payments/routes';
import analyticsRoutes from './modules/analytics/routes';
import auditRoutes from './modules/audit/routes';

export async function buildApp(){
  const app = Fastify({ logger });
  await app.register(errors);
  await app.register(security);
  await app.register(prismaPlugin);
  await app.register(jwt);
  await app.register(rbac);
  await app.register(audit);

  await app.register(healthRoutes, { prefix: '/api' });
  await app.register(authRoutes,   { prefix: '/api' });
  await app.register(userRoutes,   { prefix: '/api' });
  await app.register(serviceRoutes,{ prefix: '/api' });
  await app.register(orderRoutes,  { prefix: '/api' });
  await app.register(providerRoutes,{ prefix: '/api' });
  await app.register(paymentRoutes,{ prefix: '/api' });
  await app.register(analyticsRoutes,{ prefix: '/api' });
  await app.register(auditRoutes,  { prefix: '/api' });

  return app;
    }
