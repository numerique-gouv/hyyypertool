//

import type { Htmx_Header } from ":common/htmx";
import { ORGANISATION_EVENTS } from ":organizations/services/event";
import { zValidator } from "@hono/zod-validator";
import { Entity_Schema } from "@~/app.core/schema";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { schema } from "@~/moncomptepro.database";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { Table } from "./Table";

//

export default new Hono<MonComptePro_Pg_Context>()
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ html, req, notFound, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");

      const organization = await moncomptepro_pg.query.organizations.findFirst({
        where: eq(schema.organizations.id, id),
      });

      if (!organization) {
        return notFound();
      }

      return html(<Table organization={organization} />);
    },
  )
  .put(
    "/",
    zValidator("param", Entity_Schema),
    zValidator("form", z.object({ domain: z.string() })),
    async function PUT({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");
      const { domain } = req.valid("form");

      await moncomptepro_pg
        .update(schema.organizations)
        .set({
          external_authorized_email_domains: sql`array_append(external_authorized_email_domains, ${domain})`,
        })
        .where(eq(schema.organizations.id, id));

      return text("", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.EXTERNAL_DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  )
  .delete(
    "/:domain",
    zValidator("param", Entity_Schema.extend({ domain: z.string() })),
    async function DELETE({ text, req, var: { moncomptepro_pg } }) {
      const { id, domain } = req.valid("param");

      await moncomptepro_pg
        .update(schema.organizations)
        .set({
          external_authorized_email_domains: sql`array_remove(external_authorized_email_domains, ${domain})`,
        })
        .where(eq(schema.organizations.id, id));

      return text("", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.EXTERNAL_DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  );
