import { prisma } from '../../plugins/prisma';
export const getMe = (id: string) => prisma.user.findUnique({ where: { id }, select: { id: true, email: true, role: true, createdAt: true } });
