//

import config from "@~/app.core/config";
import { LogLevels, consola } from "consola";
import { showRoutes } from "hono/dev";
import app from "../../src/api";

//
//
//

consola.log("");
consola.log("");
consola.log("# Hyyypertool 🚀", new Date());
consola.log(Array.from({ length: 42 }).fill("=").join(""));
consola.log("");

const { ALLOWED_USERS, NODE_ENV, DEPLOY_ENV, VERSION, GIT_SHA } = config;
consola.log("");
consola.log("");
consola.log("┌─── ENV");
if (consola.level >= LogLevels.log) {
  console.table({ NODE_ENV, DEPLOY_ENV, VERSION, GIT_SHA });
}

consola.log("");
consola.log("");
consola.log("┌─── ALLOWED_USERS");
if (consola.level >= LogLevels.log) {
  console.table(ALLOWED_USERS.split(","));
}

if (consola.level >= LogLevels.debug) {
  consola.debug("");
  consola.debug("");
  consola.debug("┌─── Routes");
  showRoutes(app);

  consola.debug("");
  consola.debug("");
  consola.debug("┌─── Config");
  consola.debug(config);
}

//
//
//

export default app;
