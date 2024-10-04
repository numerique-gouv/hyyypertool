//

import type { schema } from "@~/moncomptepro.database";

//

export type User = typeof schema.users.$inferSelect;
