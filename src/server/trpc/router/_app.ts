// src/server/trpc/router/_app.ts
import { router } from '../trpc';
import { authRouter } from './auth';
import { gigRouter } from './gig';
import { corpsRouter } from './corps';
import { statsRouter } from './stats';
import { instrumentRouter } from './instrument';
import { gigTypeRouter } from './gig-type';
import { roleRouter } from './role';
import { rehearsalRouter } from './rehearsal';
import { songRouter } from './song';
import { quoteRouter } from './quote';
import { mailRouter } from './mail';

export const appRouter = router({
  auth: authRouter,
  corps: corpsRouter,
  gig: gigRouter,
  stats: statsRouter,
  instrument: instrumentRouter,
  gigType: gigTypeRouter,
  role: roleRouter,
  rehearsal: rehearsalRouter,
  song: songRouter,
  quote: quoteRouter,
  mail: mailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
