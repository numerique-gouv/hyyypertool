//

import { NotFoundError } from "@~/app.core/error";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, eq } from "drizzle-orm";

//

export function GetMember({ pg }: { pg: MonComptePro_PgDatabase }) {
  type UsersOrganizationsColumns =
    keyof typeof schema.users_organizations._.columns;
  return async function get_member_by_id<
    TColumns extends Partial<Record<UsersOrganizationsColumns, true>>,
  >(
    { organization_id, user_id }: { organization_id: number; user_id: number },
    { columns }: { columns: TColumns },
  ) {
    const member = await pg.query.users_organizations.findFirst({
      columns,
      where: and(
        eq(schema.users_organizations.organization_id, organization_id),
        eq(schema.users_organizations.user_id, user_id),
      ),
    });

    if (!member) throw new NotFoundError("Member not found.");

    return member;
  };
}

export type GetMemberHandler = ReturnType<typeof GetMember>;
