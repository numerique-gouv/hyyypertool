//

import env from ":common/env";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Env, MiddlewareHandler } from "hono";
import { Client } from "pg";
import * as schema from "./drizzle/schema";

export function moncomptepro_pg_database({
  connectionString,
}: {
  connectionString: string;
}): MiddlewareHandler<moncomptepro_pg_Context> {
  const connection = new Client({
    connectionString: connectionString ?? env.DATABASE_URL,
  });

  return async function moncomptepro_pg_middleware({ req, set }, next) {
    const moncomptepro_pg = drizzle(connection, {
      schema,
      logger: env.DEPLOY_ENV === "preview",
    });

    set("moncomptepro_pg", moncomptepro_pg);

    await next();
  };
}

//

export interface moncomptepro_pg_Context extends Env {
  Variables: {
    moncomptepro_pg: NodePgDatabase<typeof schema>;
  };
}
