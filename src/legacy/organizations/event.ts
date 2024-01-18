//

import { z } from "zod";

//

export const ORGANISATION_EVENTS = z.enum([
  "INTERNAL_DOMAIN_UPDATED",
  "EXTERNAL_DOMAIN_UPDATED",
  "MEMBERS_UPDATED",
]);
