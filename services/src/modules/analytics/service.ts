import { prisma } from '../../plugins/prisma';
export const track = (name: string, userId?: string, props?: any) => prisma.analyticsEvent.create({ data: { name, userId, props } });
