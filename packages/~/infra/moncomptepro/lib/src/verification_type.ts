//

import { z } from "zod";
import type { MCP_UserOrganizationLink } from "./moncomptepro";

//
export const Verification_Type_Schema = z.enum([
  "code_sent_to_official_contact_email",
  "in_liste_dirigeants_rna",
  "official_contact_domain",
  "official_contact_email",
  "trackdechets_email_domain",
  "verified_email_domain",
]);
export type Verification_Type = MCP_UserOrganizationLink["verification_type"];
