//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { Main_Layout, userinfo_to_username } from "@~/app.layout";
import type { App_Context } from "@~/app.middleware/context";
import { mark_domain_as_verified } from "@~/moncomptepro.lib";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import organization_domains_router from "./domains";
import organization_members_router from "./members";
import Organization_Page from "./page";

//

export default new Hono<App_Context>()
  .use("/", jsxRenderer(Main_Layout, { docType: true }))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ req, render, var: { nonce, userinfo } }) {
      const { id } = req.valid("param");
      const username = userinfo_to_username(userinfo);
      return render(<Organization_Page id={id} />, { nonce, username });
    },
  )
  //
  .route("/members", organization_members_router)
  .route("/domains", organization_domains_router)
  //
  .patch(
    "/verify/:domain",
    zValidator("param", Entity_Schema.extend({ domain: z.string() })),
    async function PATCH({ text, req }) {
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
