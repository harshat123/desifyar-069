import { TRPCError } from "@trpc/server";
import { t } from "./trpc";

// Public procedure - no authentication required
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // In a real app, you would check if the user is authenticated
  // For now, we'll simulate an authenticated user
  const user = {
    id: "user-123",
    name: "Demo User",
    email: "demo@example.com",
  };

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});