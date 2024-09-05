//

import { Entity_Schema } from "@~/app.core/schema";
import { z } from "zod";
import { schema as Type_Schema } from "./Type";

//

export const schema = Entity_Schema.extend({
  created_at: z.string(),
  type: Type_Schema,
});

export type Moderation = z.infer<typeof schema>;
