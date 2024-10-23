//

import { BadRequestError } from "@~/app.core/error";
import {
  schema,
  type MonCompteProDatabaseCradle,
} from "@~/moncomptepro.database";
import { EmailDomain_Type_Schema } from "@~/moncomptepro.lib/email_domain";

//

export function AddAuthorizedDomain({ pg }: MonCompteProDatabaseCradle) {
  return async function add_authorized_domain(
    organization_id: number,
    domain: string,
  ) {
    if (domain.includes("@"))
      throw new BadRequestError("Domain should not contain the '@' character");
    return pg.insert(schema.email_domains).values({
      domain,
      organization_id,
      verification_type: EmailDomain_Type_Schema.unwrap().enum.verified,
    });
  };
}

export type AddAuthorizedDomainHandler = ReturnType<typeof AddAuthorizedDomain>;
