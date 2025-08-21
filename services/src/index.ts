import { buildApp } from './app';
import { env } from './env';

buildApp().then(app => app.listen({ port: env.PORT, host: '0.0.0.0' }))
  .then(() => app.log.info(`API listening on :${env.PORT}`))
  .catch((e) => { console.error(e); process.exit(1); });
