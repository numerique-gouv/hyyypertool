//

import Elysia from "elysia";
import pkg from "../package.json";

//

const app = new Elysia()
  .get("/healthz", () => `healthz check passed`)
  .get("/livez", () => `livez check passed`)
  .get("/readyz", () => `readyz check passed`)
  .listen(Bun.env.PORT!, (srv) => {
    console.log(
      `${pkg.name}: http://${srv.hostname}:${srv.port}\n` +
        `- Environment: ${Bun.env.NODE_ENV}\n` +
        `- Version: v${pkg.version}`
    );
  });
