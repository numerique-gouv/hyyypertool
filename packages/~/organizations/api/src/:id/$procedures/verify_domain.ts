//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema, PAGINATION_ALL_PAGES } from "@~/app.core/schema";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { App_Context } from "@~/app.middleware/context";
import { mark_domain_as_verified } from "@~/moncomptepro.lib";
import { Verification_Type_Schema } from "@~/moncomptepro.lib/verification_type";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { GetOrganizationById } from "@~/organizations.repository";
import { get_users_by_organization_id } from "@~/users.repository/get_users_by_organization_id";
import { update_user_by_id_in_organization } from "@~/users.repository/update_user_by_id_in_organization";
import consola from "consola";
import { Hono } from "hono";
import { z } from "zod";

//

export default new Hono<App_Context>().patch(
  "/:domain",
  zValidator("param", Entity_Schema.extend({ domain: z.string() })),
  async function PATCH({ text, req, var: { moncomptepro_pg, sentry } }) {
    const { id, domain } = req.valid("param");
    const get_organization_by_id = GetOrganizationById({
      pg: moncomptepro_pg,
    });

    const { id: organization_id } = await get_organization_by_id(id, {
      columns: { id: true },
    });

    const { users: users_in_organization } = await get_users_by_organization_id(
      moncomptepro_pg,
      { organization_id, pagination: PAGINATION_ALL_PAGES },
    );

    await Promise.all(
      users_in_organization.map(({ id: user_id, email, verification_type }) => {
        const user_domain = z_email_domain.parse(email, { path: ["email"] });
        if (user_domain !== domain) return;

        const is_already_verified = z
          .string()
          .min(1)
          .safeParse(verification_type).success;
        if (is_already_verified) return;

        return update_user_by_id_in_organization(
          moncomptepro_pg,
          { organization_id, user_id },
          {
            verification_type:
              Verification_Type_Schema.Enum.verified_email_domain,
          },
        );
      }),
    );

    try {
      // NOTE(dougladuteil): still run legacy endpoint
      await mark_domain_as_verified({ domain, organization_id });
    } catch (error) {
      consola.error(error);
      sentry.captureException(error, { data: { domain, organization_id } });
    }

    return text("OK", 200, {
      "HX-Trigger": [
        ORGANISATION_EVENTS.Enum.DOMAIN_UPDATED,
        ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
      ].join(", "),
    } as Htmx_Header);
  },
);
