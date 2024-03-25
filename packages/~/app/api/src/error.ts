//

import config from "@~/app.core/config";
import { NotFoundError } from "@~/app.core/error";
import { Error_Page } from "@~/app.layout/error";
import type { App_Context } from "@~/app.middleware/context";
import consola from "consola";
import { type Context } from "hono";
import { P, match } from "ts-pattern";
import Youch from "youch";

//

export function error_handler(error: Error, c: Context) {
  const {
    get,
    html,
    notFound,
    req,
    var: { sentry },
  } = c as Context<App_Context>;

  return (
    match(error)
      // Handle false negatives here :)
      .with(P.instanceOf(NotFoundError), () => notFound())
      // OK this should not happen...
      .otherwise((error) => {
        consola.error(error);
        sentry.captureException(error);

        //

        return match(config)
          .with({ NODE_ENV: "development" }, async () => {
            const youch = new Youch(error, req.raw);
            return html(await youch.toHTML(), 500);
          })
          .otherwise(async () => {
            const nonce = get("nonce");
            return html(await Error_Page({ error, nonce }), 500);
          });
      })
  );
}
