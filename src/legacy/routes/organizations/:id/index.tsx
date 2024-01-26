//

import { api_ref } from ":api_ref";
import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import { Entity_Schema } from ":common/schema";
import {
  moncomptepro_pg,
  schema,
  type Organization,
} from ":database:moncomptepro";
import { app_hc } from ":hc";
import { ORGANISATION_EVENTS } from ":organizations/services/event";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<UserInfo_Context & Csp_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async ({ req, render, notFound, var: { nonce, userinfo } }) => {
      const { id } = req.valid("param");

      const organization = await moncomptepro_pg.query.organizations.findFirst({
        where: eq(schema.organizations.id, id),
      });

      if (!organization) {
        return notFound();
      }

      const username = userinfo_to_username(userinfo);
      return render(
        <main class="fr-container">
          <h1>👨‍💻 A propos de {organization.cached_libelle}</h1>
          <Fiche organization={organization} />
          <Edit_Domain organization={organization} />
          <hr />
          <br />
          <h3>Membres enregistrés dans cette organisation :</h3>
          <div
            hx-get={app_hc.legacy.organizations[":id"].members.$url({
              param: {
                id: organization.id.toString(),
              },
            })}
            hx-target="this"
            hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.MEMBERS_UPDATED} from:body`}
            class="fr-table"
            id="table-organisation-members"
          ></div>
        </main>,
        { nonce, username },
      );
    },
  );

//

function Fiche({ organization }: { organization: Organization }) {
  return (
    <ul>
      <li>
        id : <b>{organization.id}</b>
      </li>
      <li>
        Dénomination : <b>{organization.cached_libelle}</b>
      </li>
      <li>
        Tranche d'effectif :{" "}
        <b>{organization.cached_libelle_tranche_effectif}</b> (code :{" "}
        {organization.cached_tranche_effectifs}) (
        <a
          href="https://www.sirene.fr/sirene/public/variable/tefen"
          target="_blank"
        >
          liste code effectif INSEE
        </a>
        )
      </li>
      <li>
        État administratif : <b>{organization.cached_etat_administratif}</b> (
        <a
          href="https://www.sirene.fr/sirene/public/variable/etatAdministratifEtablissement"
          target="_blank"
        >
          liste état administratif INSEE
        </a>
        )
      </li>
      <li>
        siret : <b>{organization.siret}</b> (
        <a
          href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${organization.siret}`}
          target="_blank"
        >
          Voir la fiche annuaire entreprise de cette organisation
        </a>
        )
      </li>
    </ul>
  );
}

export async function Edit_Domain({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <div class="grid grid-cols-2">
      <div
        class="fr-table"
        hx-get={api_ref(`/legacy/organizations/:id/domains/internal`, {
          id: String(organization.id),
        })}
        hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.INTERNAL_DOMAIN_UPDATED} from:body`}
      ></div>
      <div
        class="fr-table"
        hx-get={api_ref(`/legacy/organizations/:id/domains/external`, {
          id: String(organization.id),
        })}
        hx-trigger={`load, ${ORGANISATION_EVENTS.Enum.EXTERNAL_DOMAIN_UPDATED} from:body`}
      ></div>
    </div>
  );
}
