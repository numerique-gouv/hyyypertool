//

import { button } from "@~/app.ui/button";

import type { Organization } from "@~/organizations.lib/entities/Organization";
import type { JSX } from "hono/jsx";

//

type Props = JSX.IntrinsicElements["section"] & {
  organization: Pick<Organization, "cached_code_postal" | "siret">;
};

//

export function Investigation(props: Props) {
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
