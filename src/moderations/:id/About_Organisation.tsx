//

import { app_hc } from ":hc";
import { button } from ":ui/button";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./page";

//

export function About_Organisation() {
  const {
    moderation: { organizations: organization },
  } = useContext(ModerationPage_Context);

  return (
    <section>
      <h3>
        <a
          href={
            app_hc.legacy.organizations[":id"].$url({
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
          id : <b>{organization.id}</b>
        </li>
        <li>
          siret : <b>{organization.siret}</b>
        </li>
      </ul>

      <div
        hx-get={app_hc.legacy.organizations.leaders.$url().pathname}
        hx-trigger="load"
        hx-vals={JSON.stringify({
          siret: organization.siret,
        })}
      >
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

      <hr class="bg-none" />

      <h4>🕵️ Enquête sur cette organization</h4>

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
