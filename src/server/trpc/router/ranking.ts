import { restrictedProcedure, router } from '../trpc';

export const rankingRouter = router({
  upsert: restrictedProcedure(''),
});
