import { initTRPC } from "@trpc/server";
import { Context } from "./create-context";

// Create a new instance of tRPC with context type
export const t = initTRPC.context<Context>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const middleware = t.middleware;