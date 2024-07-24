//

import { NotFoundError } from "@~/app.core/error";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { join_organization } from "@~/moncomptepro.lib";
import { and, eq } from "drizzle-orm";
import { match } from "ts-pattern";

//

export async function member_join_organization(
  { pg }: { pg: MonComptePro_PgDatabase },
  {
    moderation_id,
    is_external,
  }: { moderation_id: number; is_external: boolean },
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: { organization_id: true, user_id: true },
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  const { organization_id, user_id } = moderation;

  (await pg.query.users_organizations.findFirst({
    where: and(
      eq(schema.users_organizations.organization_id, organization_id),
      eq(schema.users_organizations.user_id, user_id),
    ),
  })) ??
    (await link_user_to_organization(
      { pg },
      {
        organization_id,
        user_id,
        is_external,
      },
    ));

  // NOTE(dougladuteil): still run legacy endpoint
  await join_organization({
    is_external,
    organization_id,
    user_id,
  });
}

async function link_user_to_organization(
  { pg }: { pg: MonComptePro_PgDatabase },
  {
    is_external,
    organization_id,
    user_id,
  }: { is_external: boolean; organization_id: number; user_id: number },
) {
  const user = await pg.query.users.findFirst({
    columns: { email: true },
    where: eq(schema.users.id, user_id),
  });
  if (!user) throw new NotFoundError("User not found.");

  const domain = z_email_domain.parse(user.email, { path: ["data.email"] });
  domain;
  const organization = await pg.query.organizations.findFirst({
    // columns: {
    //   external_authorized_email_domains: true,
    //   trackdechets_email_domains: true,
    //   verified_email_domains: true,
    // },
    where: eq(schema.organizations.id, organization_id),
  });

  if (!organization) throw new NotFoundError("Organization not found.");

  const verification_type = match(organization)
    // .with(
    //   {
    //     external_authorized_email_domains: P.when((value) =>
    //       value.includes(domain),
    //     ),
    //   },
    //   { verified_email_domains: P.when((value) => value.includes(domain)) },
    //   () => Verification_Type_Schema.Enum.verified_email_domain,
    // )
    // .when(
    //   ({ trackdechets_email_domains }) =>
    //     trackdechets_email_domains.includes(domain),
    //   () => Verification_Type_Schema.Enum.trackdechets_email_domain,
    // )
    .otherwise(() => null);

  // TODO(douglasduteil): use moncomptepro sdk setDatabaseConnection

  return pg.insert(schema.users_organizations).values({
    is_external,
    organization_id,
    user_id,
    verification_type,
  });
}
