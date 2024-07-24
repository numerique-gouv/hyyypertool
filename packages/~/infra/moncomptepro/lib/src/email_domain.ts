//

import { z } from "zod";

//

export const EmailDomain_Type_Schema = z.enum([
  "verified",
  "blacklisted",
  "official_contact",
  "authorized",
  "external",
  "trackdechet_postal_mail",
]);

export type EmailDomain_Type = z.infer<typeof EmailDomain_Type_Schema>;
