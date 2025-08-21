import { prisma } from '../../plugins/prisma';
export const getUserWallet = (userId: string) => prisma.wallet.findUnique({ where: { userId } });
