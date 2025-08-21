import { FastifyInstance } from 'fastify';
import { createServiceSchema } from '../../schemas/services';
import { listActiveServices, upsertCategory } from './service';

export default async function (app: FastifyInstance){
  app.get('/services', async () => listActiveServices());

  app.post('/admin/services', { preHandler: [app.authenticate, app.authorize(['ADMIN'])] }, async (req: any) => {
    const body = createServiceSchema.parse(req.body);
    const cat = await upsertCategory(body.categoryName);
    return app.prisma.service.create({ data: { name: body.name, description: body.description, basePrice: body.basePrice, minQty: body.minQty, maxQty: body.maxQty, categoryId: cat.id } });
  });
           } 
