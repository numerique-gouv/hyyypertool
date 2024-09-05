//

import { z } from "zod";

//

export const schema = z.enum([
  "ask_for_sponsorship",
  "big_organization_join",
  "non_verified_domain",
  "organization_join_block",
]);

export type ModerationType = z.TypeOf<typeof schema>;
