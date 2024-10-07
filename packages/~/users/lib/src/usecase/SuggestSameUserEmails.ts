//

import type { Simplify } from "@~/app.core/types";
import {
  schema,
  type MonCompteProDatabaseCradle,
  type User,
  type Users_Organizations,
} from "@~/moncomptepro.database";
import { and, eq, ilike } from "drizzle-orm";

//

type Pattern = Simplify<
  Pick<User, "family_name"> & Pick<Users_Organizations, "organization_id">
>;
export function SuggestSameUserEmails({ pg }: MonCompteProDatabaseCradle) {
  return async function suggest_same_user_emails(pattern: Pattern) {
    const { family_name, organization_id } = pattern;
    const same_family_name_members = await pg
      .select({ email: schema.users.email })
      .from(schema.users)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users.id, schema.users_organizations.user_id),
      )
      .where(
        and(
          eq(schema.users_organizations.organization_id, organization_id),
          family_name
            ? ilike(schema.users.family_name, family_name)
            : undefined,
        ),
      );

    if (same_family_name_members.length > 0)
      return same_family_name_members.map(({ email }) => email);

    const users = await pg
      .select({ email: schema.users.email })
      .from(schema.users)
      .innerJoin(
        schema.users_organizations,
        eq(schema.users.id, schema.users_organizations.user_id),
      )
      .where(eq(schema.users_organizations.organization_id, organization_id));

    return users.map(({ email }) => email);
  };
}

export type SuggestSameUserEmailsHandler = ReturnType<
  typeof SuggestSameUserEmails
>;
export type SuggestSameUserEmailsOutput = Awaited<
  ReturnType<SuggestSameUserEmailsHandler>
>;
