// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { gigRouter } from "./gig";
import { corpsRouter } from "./corps";
import { statsRouter } from "./stats";
import { instrumentRouter } from "./instrument";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  corps: corpsRouter,
  gig: gigRouter,
  stats: statsRouter,
  instrument: instrumentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
