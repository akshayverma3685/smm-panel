import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
    authorize: (roles: Array<'ADMIN'|'USER'|'RESELLER'>) => any;
  }
  interface FastifyRequest {
    user: { sub: string; role: 'ADMIN'|'USER'|'RESELLER'; email?: string };
  }
}
