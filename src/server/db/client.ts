// src/server/db/client.ts
import { PrismaClient } from '@prisma/client';
import { env } from '../../env/server.mjs';

const getNewPrismaClient = () => {
  return new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends({
    result: {
      corps: {
        fullName: {
          needs: { firstName: true, lastName: true },
          compute: (corps) => `${corps.firstName} ${corps.lastName}`,
        },
        displayName: {
          compute: (corps) =>
            corps.nickName || `${corps.firstName} ${corps.lastName}`,
        },
      },
    },
  });
};

type ExtendedPrismaClient = ReturnType<typeof getNewPrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

export const prisma = global.prisma || getNewPrismaClient();

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
