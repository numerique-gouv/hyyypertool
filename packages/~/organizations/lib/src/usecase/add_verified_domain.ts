//

import { NotFoundError } from "@~/app.core/error";
import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { markDomainAsVerified } from "@~/moncomptepro.lib/sdk";
import * as organizations_repository from "@~/organizations.repository";
//

export async function add_verified_domain(
  { pg }: { pg: MonComptePro_PgDatabase },
  { domain, organization_id }: { domain: string; organization_id: number },
) {
  const organization = await organizations_repository.get_organization_by_id(
    pg,
    { id: organization_id },
  );

  if (!organization) {
    throw new NotFoundError("Organization not found.");
  }

  return markDomainAsVerified({
    domain,
    organization_id,
    domain_verification_type: "verified",
  });
}
