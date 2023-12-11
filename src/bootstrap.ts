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
app.get("/proxy/localhost:3000/*", ({ req, redirect }) => {
  const uri = new URL(
    req.url.replace("/proxy/localhost:3000", ""),
    "http://localhost:3000",
  );
  return redirect(uri.toString());
});

if (env.DEPLOY_ENV === "preview") {
  console.debug("- NODE_ENV " + env.NODE_ENV);
  console.debug("- DEPLOY_ENV " + env.DEPLOY_ENV);
  console.debug("- VERSION " + env.VERSION);
}

export default app;
