//

import env from ":common/env";
import { moncomptepro_pg_database } from ":database:moncomptepro/middleware";
import { Duplicate_Warning } from ":moderations/:id/Duplicate_Warning";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";

//

export default new Hono().use("/", jsxRenderer()).get(
  "/",
  moncomptepro_pg_database({ connectionString: env.DATABASE_URL }),
  zValidator(
    "query",
    z.object({
      organization_id: z.string().pipe(z.coerce.number().int().nonnegative()),
      user_id: z.string().pipe(z.coerce.number().int().nonnegative()),
    }),
  ),
  async function ({ render, req }) {
    const { organization_id, user_id } = req.valid("query");
    return render(
      <Duplicate_Warning organization_id={organization_id} user_id={user_id} />,
    );
  },
);
