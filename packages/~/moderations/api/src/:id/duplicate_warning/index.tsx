//

import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { Duplicate_Warning } from "./Duplicate_Warning";

//

export default new Hono().get(
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
  async function GET({ render, req }) {
    const { id } = req.valid("param");
    const { organization_id, user_id } = req.valid("query");
    
    return render(
      <Duplicate_Warning
        moderation_id={id}
        organization_id={organization_id}
        user_id={user_id}
      />,
    );
  },
);
