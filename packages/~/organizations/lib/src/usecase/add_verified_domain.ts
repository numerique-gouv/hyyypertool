//

import { NotFoundError } from "@~/app.core/error";
import { PAGINATION_ALL_PAGES } from "@~/app.core/schema";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { mark_domain_as_verified } from "@~/moncomptepro.lib";
import { Verification_Type_Schema } from "@~/moncomptepro.lib/verification_type";
import * as organizations_repository from "@~/organizations.repository";
import { get_users_by_organization_id } from "@~/users.repository/get_users_by_organization_id";
import { update_user_by_id_in_organization } from "@~/users.repository/update_user_by_id_in_organization";
import { z } from "zod";
//

export async function add_verified_domain(
  { pg }: { pg: MonComptePro_PgDatabase },
  { domain, organization_id }: { domain: string; organization_id: number },
) {
  const organization = await organizations_repository.get_organization_by_id(
    pg,
    { id: organization_id },
  );

  if (!organization) {
    throw new NotFoundError("Organization not found.");
  }

  const { verified_email_domains, authorized_email_domains } = organization;

  await pg.transaction(async (pg_tx) => {
    if (!verified_email_domains.includes(domain)) {
      await organizations_repository.add_verified_domain(pg_tx, {
        domain,
        id: organization_id,
      });
    }

    if (!authorized_email_domains.includes(domain)) {
      await organizations_repository.add_authorized_domain(pg_tx, {
        domain,
        id: organization_id,
      });
    }
  });

  const { users: users_in_organization } = await get_users_by_organization_id(
    pg,
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
        pg,
        { organization_id, user_id },
        {
          verification_type:
            Verification_Type_Schema.Enum.verified_email_domain,
        },
      );
    }),
  );

  // NOTE(dougladuteil): still run legacy endpoint
  await mark_domain_as_verified({ domain, organization_id });
}
