import plans from './modules/billing/routes.plans';
import checkout from './modules/billing/routes.checkout';
import webhooks from './modules/billing/routes.webhooks';

export default async function (app: FastifyInstance) {
  // ...existing
  await app.register(plans, { prefix: '/api' });
  await app.register(checkout, { prefix: '/api' });
  await app.register(webhooks, { prefix: '/api' });
}
