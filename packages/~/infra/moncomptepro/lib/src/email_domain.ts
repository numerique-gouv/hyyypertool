//

import { z } from "zod";

//

export const EmailDomain_Type_Schema = z
  .enum([
    "blacklisted",
    "external",
    "official_contact",
    "trackdechet_postal_mail",
    "verified",
  ])
  .nullable();

export type EmailDomain_Type = z.infer<typeof EmailDomain_Type_Schema>;
