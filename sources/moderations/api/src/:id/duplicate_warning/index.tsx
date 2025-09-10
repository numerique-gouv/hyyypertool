//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import type { IdentiteProconnect_Pg_Context } from "@~/app.middleware/set_identite_pg";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { Duplicate_Warning } from "./Duplicate_Warning";

//

export default new Hono<IdentiteProconnect_Pg_Context>().get(
  "/",
  jsxRenderer(),
  zValidator("param", Entity_Schema),
  zValidator(
    "query",
    z.object({
      organization_id: z.string().pipe(z.coerce.number().int().nonnegative()),
      user_id: z.string().pipe(z.coerce.number().int().nonnegative()),
    }),
  ),
  async function GET({ render, req, var: { identite_pg } }) {
    const { id } = req.valid("param");
    const { organization_id, user_id } = req.valid("query");
    const value = await Duplicate_Warning.queryContextValues(identite_pg, {
      moderation_id: id,
      organization_id,
      user_id,
    });

    return render(
      <Duplicate_Warning.Context.Provider value={value}>
        <Duplicate_Warning />
      </Duplicate_Warning.Context.Provider>,
    );
  },
);
