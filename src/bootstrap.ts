//

import { csp_headers, type Csp_Context } from ":common/csp_headers";
import env from ":common/env";
import { sentry, type Sentry_Context } from ":common/sentry";
import legacy from ":legacy/route";
import { captureException } from "@sentry/bun";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import Youch from "youch";
import asserts_router from "./assets/route";
import auth_router from "./auth/route";
import { moncomptepro_pg_database } from "./database/moncomptepro/middleware";
import { readyz } from "./health/readyz";
import { NotFound } from "./not-found";
import { proxy } from "./proxy/route";
import welcome_router from "./welcome/route";

const app = new Hono<Csp_Context & Sentry_Context>()
  .use("*", logger())
  .use("*", csp_headers())
  .use("*", sentry({ scope: "main" }))
  .use("*", moncomptepro_pg_database({ connectionString: env.DATABASE_URL }))

  // import { compress } from 'hono/compress'
  // app.use("*", compress());  `CompressionStream` is not yet supported in bun.

  .get("/healthz", ({ text }) => text(`healthz check passed`))
  .get("/livez", ({ text }) => text(`livez check passed`))
  .route("/readyz", readyz)
  .route("", asserts_router)
  .route("", auth_router)
  .route("", welcome_router)
  .route("", legacy)
  .route("", proxy)
  .notFound(async ({ html, var: { nonce } }) => {
    return html(NotFound({ nonce }), 404);
  })
  .onError(async (error, { html, req }) => {
    captureException(error);
    const youch = new Youch(error, req.raw);
    return html(await youch.toHTML());
  });

//

if (env.DEPLOY_ENV === "preview") {
  showRoutes(app);
}

console.debug("- NODE_ENV " + env.NODE_ENV);
console.debug("- DEPLOY_ENV " + env.DEPLOY_ENV);
console.debug("- VERSION " + env.VERSION);
console.debug("- GIT_SHA " + env.GIT_SHA);

//

export type Router = typeof app;
export default app;
