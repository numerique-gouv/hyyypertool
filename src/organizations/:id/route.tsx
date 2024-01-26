//

import type { Htmx_Header } from ":common/htmx";
import { Entity_Schema } from ":common/schema";
import { mark_domain_as_verified } from ":legacy/services/mcp_admin_api";
import { ORGANISATION_EVENTS } from ":organizations/services/event";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import organization_members_router from "./members/route";

//

export default new Hono()
  //
  .route("members", organization_members_router)
  //
  .patch(
    "verify/:domain",
    zValidator("param", Entity_Schema.extend({ domain: z.string() })),
    async ({ text, req }) => {
      const { id, domain } = req.valid("param");

      await mark_domain_as_verified({ domain, organization_id: id });

      return text("OK", 200, {
        "HX-Trigger": [
          ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
          ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
        ].join(", "),
      } as Htmx_Header);
    },
  );
