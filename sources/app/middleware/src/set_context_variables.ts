//

import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import type { Input } from "hono/types";

//

export function set_context_variables<
  TEnv extends Env = Env,
  TPath extends string = string,
  TInput extends Input = {},
>(
  fn: () =>
    | NonNullable<TEnv["Variables"]>
    | PromiseLike<NonNullable<TEnv["Variables"]>>,
) {
  return createMiddleware<TEnv, TPath, TInput>(async (ctx, next) => {
    const context_variables = await fn();
    for (const [key, value] of Object.entries(context_variables))
      ctx.set(key as keyof TEnv["Variables"], value);
    return next();
  });
}
