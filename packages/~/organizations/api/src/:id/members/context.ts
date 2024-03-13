//

import type { Pagination } from "@~/app.core/schema";
import { type get_users_by_organization_id_dto } from "@~/users.repository/get_users_by_organization_id";
import { createContext } from "hono/jsx";

//

export const MEMBER_TABLE_PAGE_ID = "member_table_page";

//

export const MembersTable_Context = createContext({
  describedby: "",
  pagination: {} as Pagination,
  query_members_collection: {} as get_users_by_organization_id_dto,
  organization_id: NaN,
});
export const Member_Context = createContext({
  user: {} as Awaited<get_users_by_organization_id_dto>["users"][number],
});
