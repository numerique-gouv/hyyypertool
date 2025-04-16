//

import type { MonComptePro_PgDatabase, Pool } from "@~/moncomptepro.database";
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
export function set_moncomptepro_pg_client(
  client: InstanceType<typeof Pool>,
): MiddlewareHandler<MonComptePro_Pg_Client_Context> {
  return async function set_moncomptepro_pg_middleware({ set }, next) {
    set("moncomptepro_pg_client", client);
    await next();
  };
}
//

export interface MonComptePro_Pg_Context extends Env {
  Variables: {
    moncomptepro_pg: MonComptePro_PgDatabase;
  };
}

export interface MonComptePro_Pg_Client_Context extends Env {
  Variables: {
    moncomptepro_pg_client: InstanceType<typeof Pool>;
    moncomptepro_pg: MonComptePro_PgDatabase;
  };
}
