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
  const { organization } = props;

  return (
    <div class="mt-5 w-full bg-[#F6F6F6] p-3">
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}&whoWhat=Mairie`}
        class={`${button({ size: "sm", type: "tertiary" })} mr-2 bg-white`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Chercher la mairie associée
      </a>
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}`}
        class={`${button({ size: "sm", type: "tertiary" })} mr-2 bg-white`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Chercher les services publics associés
      </a>
      <a
        href={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${organization.siret.substring(0, 9)}`}
        class={`${button({ size: "sm", type: "tertiary" })} bg-white`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Voir liste dirigeants - Annuaire entreprise API
      </a>
    </div>
  );
}
