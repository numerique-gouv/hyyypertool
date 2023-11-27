//

import env from ":env";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";

//

export const www = new Hono();

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

www.use("/node_modules/*", serveStatic({}));

www.get("/bundle/lit.js", async () => {
  const {
    outputs: [output],
  } = await Bun.build({
    entrypoints: [Bun.resolveSync(`lit`, process.cwd())],
    minify: env.NODE_ENV === "production",
  });
  return new Response(output);
});

www.get("/bundle/lit/*", async ({ req }) => {
  const url = new URL(req.url);
  const filename = decodeURI(url.pathname).replace("/bundle/lit/", "");
  const {
    outputs: [output],
  } = await Bun.build({
    entrypoints: [Bun.resolveSync(`lit/${filename}`, process.cwd())],
    minify: env.NODE_ENV === "production",
  });
  return new Response(output);
});

www.use("/public/*", serveStatic({}));
