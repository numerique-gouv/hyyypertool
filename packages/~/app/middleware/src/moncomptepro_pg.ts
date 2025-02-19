//

import env from "@~/app.core/config";
import {
  Pool,
  drizzle,
  schema,
  type MonComptePro_PgDatabase,
} from "@~/moncomptepro.database";
import type { Env, MiddlewareHandler } from "hono";

//

export function moncomptepro_pg_database({
  connectionString,
}: {
  connectionString: string;
}): MiddlewareHandler<MonComptePro_Pg_Context> {
  const connection = new Pool({ connectionString: connectionString });

  return async function moncomptepro_pg_middleware({ set }, next) {
    const moncomptepro_pg = drizzle(connection, {
      schema,
      logger: env.DEPLOY_ENV === "preview",
    });

    set("moncomptepro_pg", moncomptepro_pg);
    set("moncomptepro_pg_client", connection);

    await next();
  };
}

//

export interface MonComptePro_Pg_Context extends Env {
  Variables: {
    moncomptepro_pg_client: InstanceType<typeof Pool>;
    moncomptepro_pg: MonComptePro_PgDatabase;
  };
}
