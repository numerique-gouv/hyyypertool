//

import ENV from ":env";
import { www } from ":www";
import staticPlugin from "@elysiajs/static";
import "@kitajs/html/register";
import Elysia from "elysia";
import pkg from "../package.json";
import readyz from "./health/readyz";

//

new Elysia()
  .get("/healthz", () => `healthz check passed`)
  .get("/livez", () => `livez check passed`)
  .use(readyz)
  .use(www)
  // .use(
  //   autoroutes({
  //     routesDir: "./www",
  //   }),
  // )
  //
  .use(staticPlugin())
  //
  .use(
    staticPlugin({
      assets: "node_modules/@gouvfr/dsfr",
      prefix: "/public/@gouvfr/dsfr",
    }),
  )
  .use(
    staticPlugin({
      assets: "node_modules/animate.css",
      prefix: "/public/animate.css",
    }),
  )
  .use(
    staticPlugin({
      assets: "node_modules/htmx.org",
      prefix: "/public/htmx.org",
    }),
  )
  .use(
    staticPlugin({
      assets: "node_modules/hyperscript.org",
      prefix: "/public/hyperscript.org",
    }),
  )
  //
  .listen(ENV.PORT, (srv) => {
    console.log(
      `${pkg.name}: http://${srv.hostname}:${srv.port}\n` +
        `- Environment: ${ENV.NODE_ENV}\n` +
        `- Version: v${pkg.version}`,
    );
  });
