// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getServerSession } from 'next-auth';
import { authOptionsCallback as nextAuthOptions } from '../../pages/api/auth/[...nextauth]';

// Next API route example - /pages/api/restricted.ts
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return await getServerSession(
    ctx.req,
    ctx.res,
    nextAuthOptions(ctx.req as NextApiRequest, ctx.res as NextApiResponse),
  );
};
