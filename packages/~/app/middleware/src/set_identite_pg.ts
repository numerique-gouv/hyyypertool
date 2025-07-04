//

import type {
  IdentiteProconnect_PgDatabase,
  Pool,
} from "@~/identite-proconnect.database";
import type { Env, MiddlewareHandler } from "hono";

//

export function set_identite_pg(
  client: IdentiteProconnect_PgDatabase,
): MiddlewareHandler<IdentiteProconnect_Pg_Context> {
  return async function set_identite_pg_middleware({ set }, next) {
    set("identite_pg", client);
    await next();
  };
}
export function set_identite_pg_client(
  client: InstanceType<typeof Pool>,
): MiddlewareHandler<IdentiteProconnect_Pg_Client_Context> {
  return async function set_identite_pg_middleware({ set }, next) {
    set("identite_pg_client", client);
    await next();
  };
}
//

export interface IdentiteProconnect_Pg_Context extends Env {
  Variables: {
    identite_pg: IdentiteProconnect_PgDatabase;
  };
}

export interface IdentiteProconnect_Pg_Client_Context extends Env {
  Variables: {
    identite_pg_client: InstanceType<typeof Pool>;
    identite_pg: IdentiteProconnect_PgDatabase;
  };
}
