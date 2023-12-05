//

import { initTRPC } from "@trpc/server";
import { z } from "zod";

//

export interface Context {}

//

const t = initTRPC.context<Context>().create();

//

const router = t.router;
const publicProcedure = t.procedure;

//

const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
    return `Hello ${input ?? "World"}! from hono 🔥`;
  }),
});

//

export type AppRouter = typeof appRouter;
