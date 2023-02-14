import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Prisma, PrismaClient } from '@prisma/client';
import { Adapter } from 'next-auth/adapters';

export function CustomPrismaAdapter(p: PrismaClient): Adapter {
  return {
    ...PrismaAdapter(p),
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token },
        });
        await p.verifiedToken.create({
          data: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          },
        });

        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025')
          return null;
        throw error;
      }
    },
  };
}
