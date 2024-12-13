//

import { z } from "zod";

//

export const CoopAccount_Schema = z.object({
  coordinator: z.string(),
  email: z.string().email(),
  family_name: z.string(),
  given_name: z.string(),
  phone_number: z.string(),
  professional_email: z.string(),
  siret: z.string(),
});

export type CoopAccount = z.infer<typeof CoopAccount_Schema>;
