//

import { Id_Schema } from ":common/schema";
import { hyyyyyypertool_session, type Session_Context } from ":common/session";
import {
  moncomptepro_pg,
  schema,
  type Organization,
} from ":database:moncomptepro";
import { api_ref } from ":paths";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<Session_Context>()
  .use("*", jsxRenderer(Main_Layout, { docType: true, stream: true }))
  .use("*", hyyyyyypertool_session)
  .get(
    "/",
    zValidator("param", Id_Schema),
    async ({ req, get, render, redirect, notFound }) => {
      const session = get("session");
      const userinfo = session.get("userinfo");
      if (!userinfo) {
        return redirect("/");
      }

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
            hx-get={api_ref("/legacy/organizations/:id/members", {
              id: String(organization.id),
            })}
            hx-target="this"
            hx-trigger="load, users_organizations_updated from:body"
            class="fr-table"
            id="table-organisation-members"
          ></div>
        </main>,
        { username },
      );
    },
  );

//

function Fiche({ organization }: { organization: Organization }) {
  return (
    <ul>
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
        id : <b>{organization.id}</b>
      </li>
      <li>
        siret : <b>{organization.siret}</b>
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
        hx-trigger="load, organisation_internal_domain_updated from:body"
        id="edit-domain"
      ></div>
      <div
        class="fr-table"
        hx-get={api_ref(`/legacy/organizations/:id/domains/external`, {
          id: String(organization.id),
        })}
        hx-trigger="load, organisation_external_domain_updated from:body"
        id="edit-domain"
      ></div>
    </div>
  );
}
