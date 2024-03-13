//

import { serveStatic } from "@hono/node-server/serve-static";
import env from "@~/app.core/config";
import { cache_immutable } from "@~/app.middleware/cache_immutable";
import zammad_attachment_router from "@~/zammad.api";
import { Hono } from "hono";
import { rewriteAssetRequestPath } from "./rewrite";

//

export default new Hono()
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
  .get("/bundle/config.js", async ({ text }) => {
    const { ASSETS_PATH, VERSION } = env;
    return text(
      `export default ${JSON.stringify({ ASSETS_PATH, VERSION })}`,
      200,
      {
        "content-type": "text/javascript",
      },
    );
  })
  .get("/bundle/env.js", async ({ text }) => {
    const { VERSION } = env;
    return text(`export default ${JSON.stringify({ VERSION })}`, 200, {
      "content-type": "text/javascript",
    });
  })
  .get("/bundle/lit.js", async function to_lit_bundles({ req, redirect }) {
    const url = new URL("../public/assets/node_modules/lit/index.js", req.url);
    return redirect(url.pathname);
  })
  .get("/bundle/lit/:filename{.+\\.js$}", async ({ req, redirect }) => {
    const { ASSETS_PATH } = env;
    const { filename } = req.param();
    const url = new URL(
      `${ASSETS_PATH}/public/assets/node_modules/lit/${filename}`,
      req.url,
    );
    return redirect(url.pathname);
  })
  .route("/zammad", zammad_attachment_router);
