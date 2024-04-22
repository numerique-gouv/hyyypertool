//

import { sentry } from "@hono/sentry";
import config from "@~/app.core/config";
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
import { compress } from "hono/compress";
import { logger } from "hono/logger";
import asserts_router from "./assets";
import { error_handler } from "./error";
import readyz_router from "./readyz";

//

const authoried = vip_list_guard({ vip_list: config.ALLOWED_USERS.split(",") });
const app = new Hono()
  .use("*", logger(consola.info))
  .use("*", compress())
  .use(
    "*",
    sentry({
      attachStacktrace: true,
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

  .onError(error_handler)

  .notFound(async ({ html, get }) => {
    const nonce: string = get("nonce" as any);
    return html(NotFound({ nonce }), 404);
  });

//

export type Router = typeof app;
export default app;
