//

import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";

//

export function get_orginization_domains(
  { pg }: { pg: MonComptePro_PgDatabase },
  { organization_id }: { organization_id: number },
) {
  return pg.query.email_domains.findMany({
    columns: {
      created_at: true,
      domain: true,
      id: true,
      organization_id: true,
      updated_at: true,
      verification_type: true,
      verified_at: true,
    },
    with: {
      organization: {
        columns: {
          cached_libelle: true,
        },
      },
    },
    where: (table, { eq }) => eq(table.organization_id, organization_id),
  });
}
export type get_orginization_domains_dto = Awaited<
  ReturnType<typeof get_orginization_domains>
>;
