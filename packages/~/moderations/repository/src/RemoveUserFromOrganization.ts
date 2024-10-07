//

import {
  schema,
  type MonCompteProDatabaseCradle,
} from "@~/moncomptepro.database";
import type { UserOrganizationIdPair } from "@~/organizations.lib/entities/Organization";
import { and, eq } from "drizzle-orm";

//

export function RemoveUserFromOrganization({ pg }: MonCompteProDatabaseCradle) {
  return async function remove_user_from_organization({
    organization_id,
    user_id,
  }: UserOrganizationIdPair) {
    return pg
      .delete(schema.users_organizations)
      .where(
        and(
          eq(schema.users_organizations.organization_id, organization_id),
          eq(schema.users_organizations.user_id, user_id),
        ),
      );
  };
}

export type RemoveUserFromOrganizationHandler = ReturnType<
  typeof RemoveUserFromOrganization
>;
