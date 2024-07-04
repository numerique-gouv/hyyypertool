//

import config from "@~/app.core/config";
import { Root_Layout } from "@~/app.layout/root";
import { moncomptepro_pg_database } from "@~/app.middleware/moncomptepro_pg";
import { hyyyyyypertool_session } from "@~/app.middleware/session";
import { set_config } from "@~/app.middleware/set_config";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import { vip_list_guard } from "@~/app.middleware/vip_list.guard";
import { set_sentry } from "@~/app.sentry";
import auth_router from "@~/auth.api";
import moderations_router from "@~/moderations.api";
import organizations_router from "@~/organizations.api";
import proxy_router from "@~/proxy.api";
import users_router from "@~/users.api";
import welcome_router from "@~/welcome.api";
import consola from "consola";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { jsxRenderer } from "hono/jsx-renderer";
import { logger } from "hono/logger";
import asserts_router from "./assets";
import { error_handler } from "./error";
import { not_found_handler } from "./not-found";
import readyz_router from "./readyz";

//

const authoried = vip_list_guard({ vip_list: config.ALLOWED_USERS.split(",") });
const app = new Hono()
  .use("*", logger(consola.info))
  .use("*", compress())
  .use(set_sentry())
  .use(set_nonce())
  .use(set_config())

  .get("/healthz", ({ text }) => text(`healthz check passed`))
  .get("/livez", ({ text }) => text(`livez check passed`))

  .route(config.ASSETS_PATH, asserts_router)
  .route("/readyz", readyz_router)

  //

  .route("/proxy", proxy_router)

  //

  .use("*", hyyyyyypertool_session)
  .use(set_userinfo())
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

  .use(jsxRenderer(Root_Layout))
  .onError(error_handler)
  .notFound(not_found_handler);

//

export type Router = typeof app;
export default app;
