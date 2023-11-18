//

import env from ":env";
import staticPlugin from "@elysiajs/static";
import "@kitajs/html/register";
import Elysia from "elysia";
import { compression } from "elysia-compression";
import pkg from "../package.json";
import readyz from "./health/readyz";

//

new Elysia()
  .onError(({ code, error }) => {
    return new Response(error.toString());
  })
  .get("/healthz", () => `healthz check passed`)
  .get("/livez", () => `livez check passed`)
  .use(readyz)
  //
  .use(
    staticPlugin({
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Encoding": "gzip",
      },
    }),
  )
  //
  // .use(
  //   staticPlugin({
  //     assets: "node_modules/@gouvfr/dsfr",
  //     prefix: "/public/@gouvfr/dsfr",
  //   }),
  // )
  .use(
    staticPlugin({
      assets: "node_modules/animate.css",
      prefix: "/public/animate.css",
    }),
  )
  // .use(
  //   staticPlugin({
  //     assets: "node_modules/htmx.org/dist",
  //     prefix: "/public/htmx.org/dist",
  //     //
  //     headers: {
  //       "Cache-Control": "public, max-age=31536000, immutable",
  //       "Content-Encoding": "gzip",
  //     },
  //   }),
  // )
  // .use(
  //   staticPlugin({
  //     assets: "node_modules/hyperscript.org",
  //     prefix: "/public/hyperscript.org",
  //   }),
  // )
  //
  // .use(www)
  // .use(
  //   autoroutes({
  //     routesDir: "./www",
  //   }),
  // )
  .use(compression())
  //
  .listen(env.PORT, ({ hostname, port }) => {
    console.log(
      `${pkg.name}: http://${hostname}:${port}\n` +
        `- Environment: ${env.NODE_ENV}\n` +
        `- Version: v${pkg.version}`,
    );
  });
