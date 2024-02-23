//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z.coerce.boolean";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { schema } from "@~/moncomptepro.database";
import { join_organization } from "@~/moncomptepro.lib/index";
import { Verification_Type_Schema } from "@~/moncomptepro.lib/verification_type";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

//

export default new Hono<MonComptePro_Pg_Context>()
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        is_external: z.string().pipe(z_coerce_boolean),
      }),
    ),
    zValidator(
      "param",
      Entity_Schema.extend({
        user_id: z.string().pipe(z.coerce.number()),
      }),
    ),
    async function POST({ text, req }) {
      const { id: organization_id, user_id } = req.valid("param");
      const { is_external } = req.valid("form");

      await join_organization({
        is_external,
        organization_id,
        user_id,
      });

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
      } as Htmx_Header);
    },
  )
  .patch(
    "/",
    zValidator(
      "param",
      Entity_Schema.extend({
        user_id: z.string().pipe(z.coerce.number()),
      }),
    ),
    zValidator(
      "form",
      z.object({
        verification_type: Verification_Type_Schema.or(
          z.literal(""),
        ).optional(),
        is_external: z.string().pipe(z_coerce_boolean).optional(),
      }),
    ),
    async function PATCH({ text, req, var: { moncomptepro_pg } }) {
      const { id: organization_id, user_id } = req.valid("param");
      const { verification_type, is_external } = req.valid("form");

      await moncomptepro_pg
        .update(schema.users_organizations)
        .set({
          is_external,
          verification_type,
        })
        .where(
          and(
            eq(schema.users_organizations.organization_id, organization_id),
            eq(schema.users_organizations.user_id, user_id),
          ),
        );

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
      } as Htmx_Header);
    },
  )
  .delete(
    "/",
    zValidator(
      "param",
      Entity_Schema.extend({ user_id: z.string().pipe(z.coerce.number()) }),
    ),
    async function DELETE({ text, req, var: { moncomptepro_pg } }) {
      const { id: organization_id, user_id } = req.valid("param");

      await moncomptepro_pg
        .delete(schema.users_organizations)
        .where(
          and(
            eq(schema.users_organizations.organization_id, organization_id),
            eq(schema.users_organizations.user_id, user_id),
          ),
        );

      return text("OK", 200, {
        "HX-Trigger": ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
      } as Htmx_Header);
    },
  );
