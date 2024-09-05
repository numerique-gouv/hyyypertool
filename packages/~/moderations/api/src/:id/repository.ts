//

import { NotFoundError } from "@~/app.core/error";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { and, eq } from "drizzle-orm";

//

export function GetOrganizationMember({ pg }: { pg: MonComptePro_PgDatabase }) {
  return async function get_organization_member({
    user_id,
    organization_id,
  }: {
    user_id: number;
    organization_id: number;
  }) {
    return pg.query.users_organizations.findFirst({
      columns: { is_external: true },
      where: and(
        eq(schema.users_organizations.user_id, user_id),
        eq(schema.users_organizations.organization_id, organization_id),
      ),
    });
  };
}

export type GetOrganizationMember = Awaited<
  ReturnType<typeof GetOrganizationMember>
>;

//

export function GetModeration({ pg }: { pg: MonComptePro_PgDatabase }) {
  return async function get_moderation({
    moderation_id,
  }: {
    moderation_id: number;
  }) {
    const moderation = await pg.query.moderations.findFirst({
      where: eq(schema.moderations.id, moderation_id),
      with: {
        organization: {
          columns: {
            cached_adresse: true,
            cached_code_postal: true,
            cached_etat_administratif: true,
            cached_libelle_categorie_juridique: true,
            cached_libelle_tranche_effectif: true,
            cached_libelle: true,
            cached_tranche_effectifs: true,
            cached_libelle_activite_principale: true,
            id: true,
            siret: true,
          },
        },
        user: {
          columns: {
            created_at: true,
            email: true,
            family_name: true,
            given_name: true,
            id: true,
            job: true,
            last_sign_in_at: true,
            phone_number: true,
            sign_in_count: true,
          },
        },
      },
    });
    if (!moderation) throw new NotFoundError("Moderation not found.");
    return moderation;
  };
}

export type GetModeration = ReturnType<typeof GetModeration>;
