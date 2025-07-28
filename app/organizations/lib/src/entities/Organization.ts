//

import type { schema } from "@~/identite-proconnect.database";

//

export type Organization = typeof schema.organizations.$inferSelect;
export type UserOrganizationIdPair = {
  user_id: number;
  organization_id: number;
};
