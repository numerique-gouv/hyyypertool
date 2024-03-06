//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z_coerce_boolean";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { schema } from "@~/moncomptepro.database";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { add_authorized_domain } from "@~/organizations.repository/add_authorized_domain";
import { add_verified_domain } from "@~/organizations.repository/add_verified_domain";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import { Table } from "./Table";

//

export default new Hono<MonComptePro_Pg_Context>()
  .use("/", jsxRenderer())
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({ render, req }) {
      const { id } = req.valid("param");

      return render(
        <Table.Provider organization_id={id}>
          <Table />
        </Table.Provider>,
      );
    },
  )
  .put(
    "/",
    zValidator("param", Entity_Schema),
    zValidator("form", z.object({ domain: z.string().min(1) })),
    async function PUT({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");
      const { domain } = req.valid("form");

      await moncomptepro_pg.transaction(async (pg) => {
        await add_authorized_domain(pg, { id, domain });
        await add_verified_domain(pg, { id, domain });
      });

      return text("", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
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
          authorized_email_domains: sql`array_remove(authorized_email_domains, ${domain})`,
          verified_email_domains: sql`array_remove(verified_email_domains, ${domain})`,
        })
        .where(eq(schema.organizations.id, id));

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  )
  .delete(
    "/",
    zValidator("param", Entity_Schema),
    async function DELETE({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");

      await moncomptepro_pg
        .update(schema.organizations)
        .set({
          authorized_email_domains: sql`array_remove(authorized_email_domains, '')`,
          verified_email_domains: sql`array_remove(verified_email_domains, '')`,
        })
        .where(eq(schema.organizations.id, id));

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  )
  .patch(
    "/:domain",
    zValidator("param", Entity_Schema.extend({ domain: z.string() })),
    zValidator(
      "form",
      z.object({
        is_verified: z.string().pipe(z_coerce_boolean).optional(),
      }),
    ),
    async function PATCH({ text, req, var: { moncomptepro_pg } }) {
      const { domain, id } = req.valid("param");
      const { is_verified } = req.valid("form");

      await moncomptepro_pg
        .update(schema.organizations)
        .set({
          verified_email_domains: is_verified
            ? sql`array_append(verified_email_domains, ${domain})`
            : sql`array_remove(verified_email_domains, ${domain})`,
        })
        .where(eq(schema.organizations.id, id));

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
      } as Htmx_Header);
    },
  );
