//

import type { Htmx_Header } from ":common/htmx";
import { Id_Schema } from ":common/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { ORGANISATION_EVENTS } from "./event";
//

const organization_router = new Hono()
  .basePath(":id")
  .patch(
    "verify/:domain",
    zValidator("param", Id_Schema.extend({ domain: z.string() })),
    async ({ text, req }) => {
      const { id, domain } = req.valid("param");
      console.log({ id, domain });
      return text("OK", 200, {
        "HX-Trigger": [
          ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
          ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
        ].join(", "),
      } as Htmx_Header);
    },
  );

export const organizations_router = new Hono().route("", organization_router);
