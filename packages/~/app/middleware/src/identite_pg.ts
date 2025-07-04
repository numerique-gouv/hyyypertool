//

import env from "@~/app.core/config";
import {
  Pool,
  drizzle,
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import type { Env, MiddlewareHandler } from "hono";

//

export function identite_pg_database({
  connectionString,
}: {
  connectionString: string;
}): MiddlewareHandler<IdentiteProconnect_Pg_Context> {
  const connection = new Pool({ connectionString: connectionString });

  return async function identite_pg_middleware({ set }, next) {
    const identite_pg = drizzle(connection, {
      schema,
      logger: env.DEPLOY_ENV === "preview",
    });

    set("identite_pg", identite_pg);
    set("identite_pg_client", connection);

    await next();
  };
}

//

export interface IdentiteProconnect_Pg_Context extends Env {
  Variables: {
    identite_pg_client: InstanceType<typeof Pool>;
    identite_pg: IdentiteProconnect_PgDatabase;
  };
}
