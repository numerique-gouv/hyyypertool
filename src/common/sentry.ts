//

import { init, startTransaction, type Transaction } from "@sentry/bun";
import type { Env, MiddlewareHandler } from "hono";
import env from "./env";

//

export function sentry({
  scope,
}: {
  scope: string;
}): MiddlewareHandler<Sentry_Context> {
  init({
    debug: env.DEPLOY_ENV === "preview",
    dsn: env.SENTRY_DNS,
    environment: env.DEPLOY_ENV,
    release: env.VERSION,
    tracesSampleRate: 1.0,
  });

  return async function sentry_middleware({ req, set }, next) {
    const transaction = startTransaction({
      name: req.path,
      op: scope,
      tags: { urlPath: req.path, routePath: req.routePath, host: env.HOST },
    });

    set("transaction", transaction);
    console.debug("sentry_middleware: after set transaction");

    await next();

    transaction.finish();
  };
}

//

export interface Sentry_Context extends Env {
  Variables: {
    transaction: Transaction;
  };
}
