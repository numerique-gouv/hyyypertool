//

import env from ":env";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";

//

export const www = new Hono().use("*", async ({ res, header }, next) => {
  await next();
  if (env.NODE_ENV === "development") return;
  header("cache-control", "public,max-age=31536000,immutable");
});

//

const router = new Bun.FileSystemRouter({
  style: "nextjs",
  dir: "src/www",
});

for (const [route, file_path] of Object.entries(router.routes)) {
  if (route.includes("_")) continue;

  const module = (await import(file_path)) as { default: Hono };
  www.route(route, module.default);
}

www.route(
  `/assets/${env.VERSION}`,
  new Hono()
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
    }),
);

//

function rewriteAssetRequestPath(path: string) {
  return path.replace(`/assets/${env.VERSION}`, "");
}
