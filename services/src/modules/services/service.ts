import { prisma } from '../../plugins/prisma';
export const listActiveServices = () => prisma.service.findMany({ where: { isActive: true }, include: { category: true } });
export const upsertCategory = async (name: string) => prisma.serviceCategory.upsert({ where: { name }, create: { name }, update: {} });
