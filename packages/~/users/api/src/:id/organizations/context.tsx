//

import { type Pagination } from "@~/app.core/schema";
import type { get_organisations_by_user_id_dto } from "@~/organizations.repository/get_organisations_by_user_id";
import { createContext } from "hono/jsx";

//

export const UserOrganizationTable_Context = createContext({
  pagination: {} as Pagination,
  query_organizations_collection: {} as get_organisations_by_user_id_dto,
  user_id: NaN,
});

export const UserOrganizationRow_Context = createContext(
  {} as Awaited<get_organisations_by_user_id_dto>["organizations"][number],
);
