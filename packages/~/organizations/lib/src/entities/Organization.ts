//

import type { schema } from "@~/moncomptepro.database";

//

export type Organization = typeof schema.organizations.$inferSelect;
export type UserOrganizationIdPair = {
  user_id: number;
  organization_id: number;
};
