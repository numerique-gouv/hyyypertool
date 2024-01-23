//

import env from ":common/env";
import { moncomptepro_pg_database } from ":database:moncomptepro/middleware";
import { Duplicate_Warning } from ":legacy/moderations/Duplicate_Warning";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { MonComptePro_PgClient_Context } from "../../../database/moncomptepro/MonComptePro_PgClient_Provider";

//

export default new Hono().get(
  "/",
  moncomptepro_pg_database({ connectionString: env.DATABASE_URL }),
  zValidator(
    "query",
    z.object({
      organization_id: z.string().pipe(z.coerce.number().int().nonnegative()),
      user_id: z.string().pipe(z.coerce.number().int().nonnegative()),
    }),
  ),
  async function ({ html, req, var: { moncomptepro_pg } }) {
    const { organization_id, user_id } = req.valid("query");
    return html(
      <MonComptePro_PgClient_Context.Provider
        value={{ client: moncomptepro_pg }}
      >
        <Duplicate_Warning
          organization_id={organization_id}
          user_id={user_id}
        />
      </MonComptePro_PgClient_Context.Provider>,
    );
  },
);
