//

import { csp_headers } from ":common/csp_headers";
import env from ":common/env";
// import { sentry, type Sentry_Context } from ":common/sentry";
import { vip_list_guard } from ":auth/vip_list.guard";
import { hyyyyyypertool_session } from ":common/session";
import { moncomptepro_pg_database } from ":database:moncomptepro/middleware";
import legacy from ":legacy/route";
import { moderations_router } from ":moderations/route";
import { sentry } from "@hono/sentry";
import consola, { LogLevels } from "consola";
import { Hono } from "hono";
import { logger } from "hono/logger";
import Youch from "youch";
import asserts_router from "../assets/route";
import auth_router from "../auth/route";
import { readyz } from "../health/readyz/route";
import { NotFound } from "../not-found";
import { proxy } from "../proxy/route";
import welcome_router from "../welcome/route";

//

const app = new Hono()
  .use("*", logger(consola.info))
  .use("*", csp_headers())
  .use(
    "*",
    sentry({
      debug: consola.level >= LogLevels.debug,
      dsn: env.SENTRY_DNS,
      environment: env.DEPLOY_ENV,
      release: env.VERSION,
      initialScope: {
        tags: { NODE_ENV: env.NODE_ENV, HOST: env.HOST, GIT_SHA: env.GIT_SHA },
      },
    }),
  )

  // import { compress } from 'hono/compress'
  // app.use("*", compress());  `CompressionStream` is not yet supported in bun.

  .get("/healthz", ({ text }) => text(`healthz check passed`))
  .get("/livez", ({ text }) => text(`livez check passed`))
  .route("/readyz", readyz)
  .route("", proxy)

  //

  .route("", asserts_router)
  .route("", auth_router)
  .use("*", hyyyyyypertool_session)
  .route("", welcome_router)
  .use("*", moncomptepro_pg_database({ connectionString: env.DATABASE_URL }))
  .use(
    "/moderations/*",
    vip_list_guard({ vip_list: env.ALLOWED_USERS.split(",") }),
  )
  .route("/moderations", moderations_router)
  .route("", legacy)
  .notFound(async ({ html, get }) => {
    const nonce: string = get("nonce" as any);
    return html(NotFound({ nonce }), 404);
  })
  .onError(async (error, { html, req, var: { sentry } }) => {
    consola.error(error);
    sentry.captureException(error);
    const youch = new Youch(error, req.raw);
    return html(await youch.toHTML(), 500);
  });

//

export type Router = typeof app;
export default app;