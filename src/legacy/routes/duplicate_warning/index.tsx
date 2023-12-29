//

import { Duplicate_Warning } from ":legacy/moderations/02";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

//

export default new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      organization_id: z.string().pipe(z.coerce.number().int().nonnegative()),
      user_id: z.string().pipe(z.coerce.number().int().nonnegative()),
    }),
  ),
  async function ({ html, req }) {
    const { organization_id, user_id } = req.valid("query");
    return html(
      <Duplicate_Warning organization_id={organization_id} user_id={user_id} />,
    );
  },
);
