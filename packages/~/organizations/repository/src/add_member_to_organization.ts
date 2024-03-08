//

import {
  schema,
  type MonComptePro_PgDatabase,
  type Writable_Users_Organizations,
} from "@~/moncomptepro.database";

//

export function add_member_to_organization(
  pg: MonComptePro_PgDatabase,
  values: Writable_Users_Organizations & {
    organization_id: number;
    user_id: number;
  },
) {
  return pg
    .insert(schema.users_organizations)
    .values({ ...values, created_at: new Date(), updated_at: new Date() });
}
