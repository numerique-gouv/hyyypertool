//

import { immutable } from ":common/cache";
import env from ":common/env";
import { Id_Schema } from ":common/schema";
import { get_zammad_attachment } from ":legacy/services/zammad_api";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { z } from "zod";
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
  .get(
    "/zammad/attachment/:ticket_id/:article_id/:attachment_id",
    zValidator(
      "param",
      z.object({
        article_id: Id_Schema,
        attachment_id: Id_Schema,
        ticket_id: Id_Schema,
      }),
    ),
    async function GET({ req }) {
      const { article_id, attachment_id, ticket_id } = req.valid("param");
      const image = await get_zammad_attachment({
        article_id,
        attachment_id,
        ticket_id,
      });

      return image;
    },
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
