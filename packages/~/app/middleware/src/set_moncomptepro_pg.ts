//

import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import type { Env, MiddlewareHandler } from "hono";

//

export function set_moncomptepro_pg(
  client: MonComptePro_PgDatabase,
): MiddlewareHandler<MonComptePro_Pg_Context> {
  return async function set_moncomptepro_pg_middleware({ set }, next) {
    set("moncomptepro_pg", client);
    await next();
  };
}
//

export interface MonComptePro_Pg_Context extends Env {
  Variables: {
    moncomptepro_pg: MonComptePro_PgDatabase;
  };
}
