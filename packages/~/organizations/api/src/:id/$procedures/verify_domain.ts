//

import { zValidator } from "@hono/zod-validator";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema, PAGINATION_ALL_PAGES } from "@~/app.core/schema";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { Verification_Type_Schema } from "@~/moncomptepro.lib/verification_type";
import { ORGANISATION_EVENTS } from "@~/organizations.lib/event";
import { add_authorized_domain } from "@~/organizations.repository/add_authorized_domain";
import { add_verified_domain } from "@~/organizations.repository/add_verified_domain";
import { get_organization_by_id } from "@~/organizations.repository/get_organization_by_id";
import { get_users_by_organization_id } from "@~/users.repository/get_users_by_organization_id";
import { update_user_by_id_in_organization } from "@~/users.repository/update_user_by_id_in_organization";
import { Hono } from "hono";
import { z } from "zod";

//

export default new Hono<MonComptePro_Pg_Context>().patch(
  "/:domain",
  zValidator("param", Entity_Schema.extend({ domain: z.string() })),
  async function PATCH({ text, notFound, req, var: { moncomptepro_pg } }) {
    const { id, domain } = req.valid("param");

    const organization = await get_organization_by_id(moncomptepro_pg, {
      id,
    });
    if (!organization) {
      return notFound();
    }

    const { verified_email_domains, authorized_email_domains } = organization;

    await moncomptepro_pg.transaction(async (pg) => {
      if (!verified_email_domains.includes(domain)) {
        await add_verified_domain(pg, { domain, id });
      }

      if (!authorized_email_domains.includes(domain)) {
        await add_authorized_domain(pg, { domain, id });
      }
    });

    const { users: users_in_organization } = await get_users_by_organization_id(
      moncomptepro_pg,
      { organization_id: id, pagination: PAGINATION_ALL_PAGES },
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
          { organization_id: id, user_id },
          {
            verification_type:
              Verification_Type_Schema.Enum.verified_email_domain,
          },
        );
      }),
    );

    return text("OK", 200, {
      "HX-Trigger": [
        ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED,
        ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED,
      ].join(", "),
    } as Htmx_Header);
  },
);
