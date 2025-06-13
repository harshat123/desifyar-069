import { router } from './trpc';
import { hiProcedure } from './routes/example/hi/route';
import { createFlyerProcedure } from './routes/flyers/create/route';

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  flyers: router({
    create: createFlyerProcedure,
  }),
});

export type AppRouter = typeof appRouter;