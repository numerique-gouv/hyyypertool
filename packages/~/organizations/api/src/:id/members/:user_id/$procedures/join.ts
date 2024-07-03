//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z_coerce_boolean";
import type { App_Context } from "@~/app.middleware/context";
import { join_organization } from "@~/moncomptepro.lib/index";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { add_member_to_organization } from "@~/organizations.repository/add_member_to_organization";
import { get_user_in_organization } from "@~/users.repository/get_user_in_organization";
import consola from "consola";
import { Hono } from "hono";
import { z } from "zod";

//

export default new Hono<App_Context>().post(
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
  async function POST({ text, req, var: { moncomptepro_pg, sentry } }) {
    const { id: organization_id, user_id } = req.valid("param");
    const { is_external } = req.valid("form");

    consola.debug({ organization_id, user_id, is_external });
    (await get_user_in_organization(moncomptepro_pg, {
      organization_id,
      user_id,
    })) ??
      (await add_member_to_organization(moncomptepro_pg, {
        is_external,
        organization_id,
        user_id,
      }));

    try {
      // NOTE(dougladuteil): still run legacy endpoint
      await join_organization({
        is_external,
        organization_id,
        user_id,
      });
    } catch (error) {
      consola.error(error);
      sentry.captureException(error, {
        data: { is_external, organization_id, user_id },
      });
    }

    return text("OK", 200, {
      "HX-Trigger": ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
    } as Htmx_Header);
  },
);
