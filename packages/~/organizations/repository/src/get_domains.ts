//

import { type MonComptePro_PgDatabase } from "@~/moncomptepro.database";

//

export async function get_domains(
  pg: MonComptePro_PgDatabase,
  { organization_id }: { organization_id: number },
) {
  return pg.query.email_domains.findMany({
    where: (email_domains, { eq }) =>
      eq(email_domains.organization_id, organization_id),
    columns: {
      domain: true,
    },
  });
}

export type get_domains_dto = Awaited<ReturnType<typeof get_domains>>;
