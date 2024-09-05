//

import { button } from "@~/app.ui/button";
import { hx_urls, urls } from "@~/app.urls";
import { type Organization } from "@~/moncomptepro.database";
import { type JSX } from "hono/jsx";

//

type AboutOrganizationProps = {
  organization: Pick<
    Organization,
    | "cached_adresse"
    // | "cached_code_postal"
    | "cached_etat_administratif"
    | "cached_libelle_activite_principale"
    | "cached_libelle_categorie_juridique"
    | "cached_libelle_tranche_effectif"
    | "cached_libelle"
    | "cached_tranche_effectifs"
    | "id"
    | "siret"
  >;
};

export async function AboutOrganization(props: AboutOrganizationProps) {
  const { organization } = props;
  const hx_organizations_leaders_props =
    await hx_urls.organizations.leaders.$get({
      query: { siret: organization.siret },
    });

  return (
    <section>
      <h3>
        <a
          href={
            urls.organizations[":id"].$url({
              param: {
                id: organization.id.toString(),
              },
            }).pathname
          }
        >
          🏛 Organisation
        </a>
      </h3>

      <ul class="list-none pl-0">
        <li>
          Dénomination : <b>{organization.cached_libelle}</b>
        </li>
        <li>
          <span title="Activité principale de l’établissement">NAF/APE</span> :{" "}
          <b>{organization.cached_libelle_activite_principale}</b>
        </li>
        <li>
          Nature juridique :{" "}
          <b>{organization.cached_libelle_categorie_juridique}</b>
        </li>
        <li>
          Tranche d'effectif :{" "}
          <b>{organization.cached_libelle_tranche_effectif}</b> (code :{" "}
          <span>{organization.cached_tranche_effectifs}</span>) (
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
          Siret : <b>{organization.siret}</b>
        </li>
      </ul>

      <div {...hx_organizations_leaders_props} hx-trigger="load">
        Recherche des dirigeants...
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
    </section>
  );
}

//

type InvestigationOrganizationProps = JSX.IntrinsicElements["section"] & {
  organization: Pick<Organization, "cached_code_postal" | "siret">;
};
export function InvestigationOrganization(
  props: InvestigationOrganizationProps,
) {
  const { organization, ...section_props } = props;

  return (
    <section {...section_props}>
      <h4>🕵️ Enquête sur cette organisation</h4>

      <ul class="list-none pl-0">
        <li>
          <a
            href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}&whoWhat=Mairie`}
            class={button({ size: "sm", type: "tertiary" })}
            rel="noopener noreferrer"
            target="_blank"
          >
            Mairie sur Annuaire Service Public
          </a>
        </li>
        <li>
          <a
            href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}`}
            class={button({ size: "sm", type: "tertiary" })}
            rel="noopener noreferrer"
            target="_blank"
          >
            Service sur Annuaire Service Public
          </a>
        </li>
        <li>
          <a
            href={`https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-annuaire-education/records?where=siren_siret%3D${organization.siret}`}
            class={button({ size: "sm", type: "tertiary" })}
            rel="noopener noreferrer"
            target="_blank"
          >
            Établissement sur l'annuaire Éducation Nationale
          </a>
        </li>
      </ul>
    </section>
  );
}
