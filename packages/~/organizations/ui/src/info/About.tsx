//

import { button } from "@~/app.ui/button";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls } from "@~/app.urls";
import type { GetFicheOrganizationByIdHandler } from "@~/organizations.lib/usecase";
import { type JSX } from "hono/jsx";
import { InactiveWarning } from "./InactiveWarning";

//

type Props = JSX.IntrinsicElements["section"] & {
  organization: Awaited<ReturnType<GetFicheOrganizationByIdHandler>>;
};

export async function About(props: Props) {
  const { organization, ...section_props } = props;
  const hx_organizations_leaders_props =
    await hx_urls.organizations.leaders.$get({
      query: { siret: organization.siret },
    });

  return (
    <section {...section_props}>
      <InactiveWarning organization={organization} />
      <ul class="list-none pl-0">
        <li>
          Creation de l'organisation :{" "}
          <b>
            <LocalTime date={organization.created_at} />
          </b>
        </li>
        <li>
          Nature juridique :{" "}
          <b>
            {organization.cached_libelle_categorie_juridique} (
            {organization.cached_categorie_juridique})
          </b>
        </li>
        <li>
          Dénomination : <b>{organization.cached_libelle}</b>
        </li>
        <li>
          Nom complet : <b>{organization.cached_nom_complet}</b>
        </li>
        <li>
          Enseigne : <b>{organization.cached_enseigne}</b>
        </li>
        <li>
          NAF/APE : <b>{organization.cached_libelle_activite_principale}</b>
        </li>
        <li>
          Tranche d'effectif :{" "}
          <b>{organization.cached_libelle_tranche_effectif}</b> (code :{" "}
          {organization.cached_tranche_effectifs}) (
          <a
            href="https://www.sirene.fr/sirene/public/variable/tefen"
            rel="noopener noreferrer"
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
            rel="noopener noreferrer"
            target="_blank"
          >
            liste état administratif INSEE
          </a>
          )
        </li>
        <li>
          Adresse : <b>{organization.cached_adresse}</b>
        </li>
        <li>
          Code officiel géographique :{" "}
          <b>{organization.cached_code_officiel_geographique}</b>
        </li>
        <li>
          Siret : <b>{organization.siret}</b> (
          <a
            href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${organization.siret}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Voir la fiche annuaire entreprise de cette organisation
          </a>
          )
        </li>
      </ul>

      <div class="my-4" {...hx_organizations_leaders_props} hx-trigger="load">
        <i class="text-center">Recherche des dirigeants...</i>
      </div>

      <a
        href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${organization.siret}`}
        class={button({ size: "sm", type: "tertiary" })}
        rel="noopener noreferrer"
        target="_blank"
      >
        Fiche sur l’Annuaire des Entreprises
      </a>

      <a
        href={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${organization.siret.substring(0, 9)}`}
        class={button({ size: "sm", type: "tertiary" })}
        rel="noopener noreferrer"
        target="_blank"
      >
        Liste des Dirigeants - Annuaire des Entreprises
      </a>

      <details class="my-6">
        <summary>Détails de l'organisation</summary>
        <ul>
          <li>
            id : <b>{organization.id}</b>
          </li>
          <li>
            Dernière mise à jour :{" "}
            <b>
              <LocalTime date={organization.updated_at} />
            </b>
          </li>
        </ul>
      </details>
    </section>
  );
}
