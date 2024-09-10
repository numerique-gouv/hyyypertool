//

import { markDomainAsVerified } from "@~/moncomptepro.lib/sdk";
import type { GetOrganizationByIdHandler } from "@~/organizations.repository";
//

export async function add_verified_domain(
  {
    get_organization_by_id,
  }: { get_organization_by_id: GetOrganizationByIdHandler },
  { domain, organization_id }: { domain: string; organization_id: number },
) {
  await get_organization_by_id(organization_id, { columns: { id: true } });

  return markDomainAsVerified({
    domain,
    organization_id,
    domain_verification_type: "verified",
  });
}
