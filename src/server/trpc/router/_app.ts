// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { gigRouter } from "./gig";
import { corpsRouter } from "./corps";
import { statsRouter } from "./stats";
import { instrumentRouter } from "./instrument";
import { gigTypeRouter } from "./gig-type";

export const appRouter = router({
  auth: authRouter,
  corps: corpsRouter,
  gig: gigRouter,
  stats: statsRouter,
  instrument: instrumentRouter,
  gigType: gigTypeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
