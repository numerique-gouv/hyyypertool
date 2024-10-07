//

import { z_coerce_boolean } from "@~/app.core/schema/z_coerce_boolean";
import { z } from "zod";

//

export const validate_form_schema = z.object({
  add_domain: z.string().default("false").pipe(z_coerce_boolean),
  add_member: z.enum(["AS_INTERNAL", "AS_EXTERNAL"]),
  send_notitfication: z.string().default("false").pipe(z_coerce_boolean),
});
