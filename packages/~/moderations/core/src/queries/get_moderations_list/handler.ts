//

import type { Pagination } from "@~/app.core/schema";
import type { Moderation, SearchParams } from "./schema";

//

export type GetModerationsList = (params: {
  search: SearchParams;
  pagination?: Pagination;
}) => Promise<{ moderations: Moderation[]; count: number }>;
