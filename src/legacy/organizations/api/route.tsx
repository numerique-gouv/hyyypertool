//

import type { Htmx_Header } from ":common/htmx";
import { Id_Schema } from ":common/schema";
import { mark_domain_as_verified } from ":legacy/services/mcp_admin_api";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { ORGANISATION_EVENTS } from "../event";
import { organization_members_router } from "./members";
//

const organization_router = new Hono()
  .basePath(":id")
  .route("members", organization_members_router)
  .patch(
    "verify/:domain",
    zValidator("param", Id_Schema.extend({ domain: z.string() })),
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

export const organizations_router = new Hono().route("", organization_router);
