//

import { createContainer, type AwilixContainer } from "awilix";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";

//

export function set_injector<TCradle extends object>(
  fn?: (injector: AwilixContainer<TCradle>) => void,
) {
  type DiEnv = Env & { Variables: { injector: AwilixContainer<TCradle> } };
  return createMiddleware<DiEnv>((c, next) => {
    const container = createContainer<TCradle>({
      strict: true,
    });
    c.set("injector", container);
    if (fn) fn(c.var.injector);
    return next();
  });
}

export function set_scope<TCradle extends object>(
  fn?: (injector: AwilixContainer<TCradle>) => void,
) {
  type DiEnv = Env & { Variables: { injector: AwilixContainer<TCradle> } };
  return createMiddleware<DiEnv>(async (c, next) => {
    if (!c.var.injector)
      throw new Error(`"c.var.injector" is required. use set_injector fist`);
    const parent_injector = c.var.injector;
    const injector = parent_injector.createScope();
    c.set("injector", injector);
    if (fn) fn(injector);
    return next();
  });
}
