//

import {
  schema,
  type MonCompteProDatabaseCradle,
} from "@~/moncomptepro.database";
import type { UserOrganizationIdPair } from "@~/organizations.lib/entities/Organization";
import { and, eq } from "drizzle-orm";

//

export function IsUserExternalMember({ pg }: MonCompteProDatabaseCradle) {
  return async function is_user_external_member({
    organization_id,
    user_id,
  }: UserOrganizationIdPair) {
    const user_organization = await pg.query.users_organizations.findFirst({
      columns: { is_external: true },
      where: and(
        eq(schema.users_organizations.user_id, user_id),
        eq(schema.users_organizations.organization_id, organization_id),
      ),
    });

    return user_organization?.is_external ?? false;
  };
}

export type IsUserExternalMemberHandler = ReturnType<
  typeof IsUserExternalMember
>;
export type IsUserExternalMemberOutput = Awaited<
  ReturnType<IsUserExternalMemberHandler>
>;
