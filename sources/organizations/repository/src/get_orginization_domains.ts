//

import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";

//

export function get_orginization_domains(
  { pg }: { pg: IdentiteProconnect_PgDatabase },
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
