//

import { immutable } from ":common/cache";
import env from ":common/env";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { ASSETS_PATH } from "./config";
import { rewriteAssetRequestPath } from "./rewrite";

//

const asserts_router = new Hono()
  .use("*", immutable)
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
  .get("/bundle/env.js", async ({ text }) => {
    const { VERSION } = env;
    return text(`export default ${JSON.stringify({ VERSION })}`, 200, {
      "content-type": "text/javascript",
    });
  })
  .get("/bundle/lit.js", async () => {
    const {
      outputs: [output],
    } = await Bun.build({
      entrypoints: [Bun.resolveSync(`lit`, process.cwd())],
      minify: env.NODE_ENV === "production",
    });
    return new Response(output);
  })
  .get("/bundle/lit/*", async ({ req }) => {
    const url = new URL(req.url);
    const filename = decodeURI(rewriteAssetRequestPath(url.pathname)).replace(
      "/bundle/lit/",
      "",
    );

    const {
      outputs: [output],
    } = await Bun.build({
      entrypoints: [Bun.resolveSync(`lit/${filename}`, process.cwd())],
      minify: env.NODE_ENV === "production",
    });

    return new Response(output);
  });

export default new Hono().route(ASSETS_PATH, asserts_router);
