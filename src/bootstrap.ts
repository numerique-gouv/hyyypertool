//

import { www } from ":www";
import "@kitajs/html/register";
import Elysia from "elysia";
import { autoroutes } from "elysia-autoroutes";
import pkg from "../package.json";

//

new Elysia()
  .get("/healthz", () => `healthz check passed`)
  .get("/livez", () => `livez check passed`)
  .get("/readyz", () => `readyz check passed`)
  .use(www)
  .use(
    autoroutes({
      routesDir: "./www",
    }),
  )
  .listen(Bun.env.PORT!, (srv) => {
    console.log(
      `${pkg.name}: http://${srv.hostname}:${srv.port}\n` +
        `- Environment: ${Bun.env.NODE_ENV}\n` +
        `- Version: v${pkg.version}`,
    );
  });
