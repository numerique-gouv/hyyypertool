//

import type { schema } from ":database:moncomptepro";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { createContext, useContext } from "hono/jsx";

//

export const MonComptePro_PgClient_Context = createContext({
  client: {} as NodePgDatabase<typeof schema>,
});

export function use_MonComptePro_PgClient() {
  return useContext(MonComptePro_PgClient_Context).client;
}
