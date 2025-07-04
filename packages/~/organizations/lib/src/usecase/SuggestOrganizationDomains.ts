//

import { type IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect.database";
import { get_domains } from "@~/organizations.repository/get_domains";

//

export function SuggestOrganizationDomains({
  pg,
}: IdentiteProconnectDatabaseCradle) {
  return async function suggest_organization_domains(organization_id: number) {
    const domains = await get_domains(pg, { organization_id });
    return domains.map(({ domain }) => domain);
  };
}

export type SuggestOrganizationDomainsHandler = ReturnType<
  typeof SuggestOrganizationDomains
>;
