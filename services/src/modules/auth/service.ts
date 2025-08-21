import { prisma } from '../../plugins/prisma';
import argon2 from 'argon2';

export async function createUser(email: string, password: string, name?: string){
  const passwordHash = await argon2.hash(password);
  return prisma.user.create({ data: { email, passwordHash, name, wallet: { create: {} } } });
}

export async function verifyUser(email: string, password: string){
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null; const ok = await argon2.verify(user.passwordHash, password); return ok ? user : null;
    }
