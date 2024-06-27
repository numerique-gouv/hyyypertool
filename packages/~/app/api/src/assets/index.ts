//

import { serveStatic } from "@hono/node-server/serve-static";
import { type AppVariables_Context } from "@~/app.core/config";
import { cache_immutable } from "@~/app.middleware/cache_immutable";
import zammad_attachment_router from "@~/zammad.api";
import { Hono } from "hono";
import { rewriteAssetRequestPath } from "./rewrite";

//

export default new Hono<AppVariables_Context>()
  .use("*", cache_immutable)
  .use(
    "/node_modules/*",
    serveStatic({
      rewriteRequestPath: rewriteAssetRequestPath,
    }),
  )
  .use(
    "/public/*",
    serveStatic({
      rewriteRequestPath: rewriteAssetRequestPath,
    }),
  )
  .get("/bundle/config.js", async ({ text, var: { config } }) => {
    const { ASSETS_PATH, PUBLIC_ASSETS_PATH, VERSION } = config;
    return text(
      `export default ${JSON.stringify({ ASSETS_PATH, PUBLIC_ASSETS_PATH, VERSION })}`,
      200,
      {
        "content-type": "text/javascript",
      },
    );
  })
  .get("/bundle/env.js", async ({ text, var: { config } }) => {
    const { VERSION } = config;
    return text(`export default ${JSON.stringify({ VERSION })}`, 200, {
      "content-type": "text/javascript",
    });
  })
  .route("/zammad", zammad_attachment_router);
