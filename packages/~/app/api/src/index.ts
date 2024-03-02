//

import { sentry } from "@hono/sentry";
import config from "@~/app.core/config";
import { Error_Page } from "@~/app.layout/error";
import { NotFound } from "@~/app.layout/not-found";
import { moncomptepro_pg_database } from "@~/app.middleware/moncomptepro_pg";
import { hyyyyyypertool_session } from "@~/app.middleware/session";
import { vip_list_guard } from "@~/app.middleware/vip_list.guard";
import auth_router from "@~/auth.api";
import moderations_router from "@~/moderations.api";
import organizations_router from "@~/organizations.api";
import proxy_router from "@~/proxy.api";
import users_router from "@~/users.api";
import welcome_router from "@~/welcome.api";
import consola, { LogLevels } from "consola";
import { Hono } from "hono";
import { logger } from "hono/logger";
import Youch from "youch";
import asserts_router from "./assets";
import readyz_router from "./readyz";

//

const authoried = vip_list_guard({ vip_list: config.ALLOWED_USERS.split(",") });
const app = new Hono()
  .use("*", logger(consola.info))
  .use(
    "*",
    sentry({
      debug: consola.level >= LogLevels.debug,
      dsn: config.SENTRY_DNS,
      environment: config.DEPLOY_ENV,
      release: config.VERSION,
      initialScope: {
        tags: {
          NODE_ENV: config.NODE_ENV,
          HOST: config.HOST,
          GIT_SHA: config.GIT_SHA,
        },
      },
    }),
  )

  // import { compress } from 'hono/compress'
  // app.use("*", compress());  `CompressionStream` is not yet supported in bun.

  .get("/healthz", ({ text }) => text(`healthz check passed`))
  .get("/livez", ({ text }) => text(`livez check passed`))

  .route(config.ASSETS_PATH, asserts_router)
  .route("/readyz", readyz_router)

  //

  .route("/proxy", proxy_router)

  //

  .use("*", hyyyyyypertool_session)
  //
  .route("/", welcome_router)
  .route("/auth", auth_router)
  //
  .use("*", moncomptepro_pg_database({ connectionString: config.DATABASE_URL }))
  //

  .use("/moderations/*", authoried)
  .route("/moderations", moderations_router)

  .use("/users/*", authoried)
  .route("/users", users_router)

  .use("/organizations/*", authoried)
  .route("/organizations", organizations_router)

  .notFound(async ({ html, get }) => {
    const nonce: string = get("nonce" as any);
    return html(NotFound({ nonce }), 404);
  })
  .onError(async (error, { get, html, req, var: { sentry } }) => {
    consola.error(error);
    sentry.captureException(error);

    if (config.NODE_ENV === "production") {
      const youch = new Youch(error, req.raw);
      return html(await youch.toHTML(), 500);
    } else {
      const nonce: string = get("nonce" as any);
      return html(await Error_Page({ error, nonce }), 500);
    }
  });

//

export type Router = typeof app;
export default app;
