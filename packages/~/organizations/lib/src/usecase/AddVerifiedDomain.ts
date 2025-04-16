//

import { type MarkDomainAsVerifiedHandler } from "@~/moncomptepro.lib/sdk";
import type { GetFicheOrganizationByIdHandler } from "./GetFicheOrganizationById";

//

export function AddVerifiedDomain({
  get_organization_by_id,
  mark_domain_as_verified,
}: {
  get_organization_by_id: GetFicheOrganizationByIdHandler;
  mark_domain_as_verified: MarkDomainAsVerifiedHandler;
}) {
  return async function add_verified_domain({
    domain,
    organization_id,
  }: {
    domain: string;
    organization_id: number;
  }) {
    await get_organization_by_id(organization_id);

    return mark_domain_as_verified({
      domain,
      organization_id,
      domain_verification_type: "verified",
    });
  };
}
