//

import env from ":env";
import { www } from ":www";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { readyz } from "./health/readyz";

//

const app = new Hono();

app.use("*", logger());
// import { compress } from 'hono/compress'
// app.use("*", compress());  `CompressionStream` is not yet supported in bun.
app.get("/healthz", ({ text }) => text(`healthz check passed`));
app.get("/livez", ({ text }) => text(`livez check passed`));
app.route("/readyz", readyz);
app.route("/", www);

if (env.DEPLOY_ENV === "preview") {
  app.showRoutes();
}

export default app;
