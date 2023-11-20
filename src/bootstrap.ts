//

import env from ":env";
import { www } from ":www";
import "@kitajs/html/register";
import Elysia from "elysia";
import { compression } from "elysia-compression";
import pkg from "../package.json";
import readyz from "./health/readyz";

//

new Elysia()
  //
  .get("/healthz", () => `healthz check passed`)
  .get("/livez", () => `livez check passed`)
  .use(readyz)
  //
  .use(www)
  //
  .use(compression())
  //
  .listen(env.PORT, ({ hostname, port }) => {
    console.log(
      `${pkg.name}: http://${hostname}:${port}\n` +
        `- Environment: ${env.NODE_ENV}\n` +
        `- Version: v${pkg.version}`,
    );
  });
