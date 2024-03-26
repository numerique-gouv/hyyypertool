//

import { z } from "zod";

//

export type Moderation_Type =
  | "ask_for_sponsorship"
  | "big_organization_join"
  | "non_verified_domain"
  | "organization_join_block";

export const Moderation_Type_Schema = z.enum([
  "ask_for_sponsorship",
  "big_organization_join",
  "non_verified_domain",
  "organization_join_block",
]);
