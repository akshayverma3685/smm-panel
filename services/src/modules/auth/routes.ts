import { FastifyInstance } from 'fastify';
import { registerSchema, loginSchema } from '../../schemas/auth';
import { createUser, verifyUser } from './service';

export default async function (app: FastifyInstance){
  app.post('/auth/register', async (req, reply) => {
    const body = registerSchema.parse(req.body);
    const user = await createUser(body.email, body.password, body.name);
    const token = app.jwt.sign({ sub: user.id, role: user.role });
    return { token };
  });

  app.post('/auth/login', async (req, reply) => {
    const body = loginSchema.parse(req.body);
    const user = await verifyUser(body.email, body.password);
    if (!user) return reply.unauthorized('invalid credentials');
    const token = app.jwt.sign({ sub: user.id, role: user.role });
    return { token };
  });
      }
