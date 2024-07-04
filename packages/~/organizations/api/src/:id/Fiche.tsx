//

import { button } from "@~/app.ui/button";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls } from "@~/app.urls";
import { usePageRequestContext } from "./context";

//

export async function Fiche() {
  const {
    var: { organization },
  } = usePageRequestContext();
  const hx_organizations_leaders_props =
    await hx_urls.organizations.leaders.$get({
      query: { siret: organization.siret },
    });

  return (
    <section class="grid grid-cols-2">
      <ul>
        <li>
          ID : <b>{organization.id}</b>
        </li>
        <li>
          Creation de l'organisation :{" "}
          <b>
            <LocalTime date={organization.created_at} />
          </b>
        </li>
        <li>
          Nature juridique :{" "}
          <b>{organization.cached_libelle_categorie_juridique}</b>
        </li>
        <li>
          Dernière mise à jour :{" "}
          <b>
            <LocalTime date={organization.updated_at} />
          </b>
        </li>
        <li>
          Dénomination : <b>{organization.cached_libelle}</b>
        </li>
        <li>
          Nom complet : <b>{organization.cached_nom_complet}</b>
        </li>
        <li>
          NAF/APE : <b>{organization.cached_activite_principale}</b>
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
      <article class="flex flex-col gap-4">
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

        <hr class="bg-none" />

        <h4>🕵️ Enquête sur cette organisation</h4>
        <a
          href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}&whoWhat=Mairie`}
          class={button({ size: "sm", type: "tertiary" })}
          rel="noopener noreferrer"
          target="_blank"
        >
          Mairie sur Annuaire Service Public
        </a>

        <a
          href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}`}
          class={button({ size: "sm", type: "tertiary" })}
          rel="noopener noreferrer"
          target="_blank"
        >
          Service sur Annuaire Service Public
        </a>

        <a
          href={`https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-annuaire-education/records?where=siren_siret%3D${organization.siret}`}
          class={button({ size: "sm", type: "tertiary" })}
          rel="noopener noreferrer"
          target="_blank"
        >
          Établissement sur l'annuaire Éducation Nationale
        </a>
      </article>
    </section>
  );
}
