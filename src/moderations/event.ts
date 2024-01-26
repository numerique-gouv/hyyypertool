//

import { z } from "zod";

//

export const MODERATION_EVENTS = z.enum([
  "MODERATIONS_UPDATED",
  "MODERATION_EMAIL_UPDATED",
]);
