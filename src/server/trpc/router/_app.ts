// src/server/trpc/router/_app.ts
import { router } from '../trpc';
import { authRouter } from './auth';
import { gigRouter } from './gig';
import { corpsRouter } from './corps';
import { statsRouter } from './stats';
import { instrumentRouter } from './instrument';
import { gigTypeRouter } from './gig-type';
import { rehearsalRouter } from './rehearsal';
import { songRouter } from './song';
import { quoteRouter } from './quote';
import { mailRouter } from './mail';
import { sectionRouter } from './section';
import { killerRouter } from './killer';
import { permissionRouter } from './permission';
import { streckRouter } from './streck';

export const appRouter = router({
  auth: authRouter,
  corps: corpsRouter,
  gig: gigRouter,
  stats: statsRouter,
  instrument: instrumentRouter,
  gigType: gigTypeRouter,
  rehearsal: rehearsalRouter,
  song: songRouter,
  quote: quoteRouter,
  mail: mailRouter,
  section: sectionRouter,
  killer: killerRouter,
  permission: permissionRouter,
  streck: streckRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
