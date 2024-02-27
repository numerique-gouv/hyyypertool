//

import { type Pagination } from "@~/app.core/schema";
import type { get_organisations_by_user_id_dto } from "@~/organizations.repository/get_organisations_by_user_id";
import { createContext } from "hono/jsx";

//

export default createContext({
  pagination: {} as Pagination,
  query_organizations_collection: {} as get_organisations_by_user_id_dto,
  user_id: NaN,
});
