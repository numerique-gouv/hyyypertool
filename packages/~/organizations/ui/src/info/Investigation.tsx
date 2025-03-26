//

import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";

import type { Organization } from "@~/organizations.lib/entities/Organization";
import type { JSX } from "hono/jsx";

//

type Props = JSX.IntrinsicElements["section"] & {
  organization: Pick<Organization, "cached_code_postal" | "siret">;
};

//

export async function Investigation(props: Props) {
  const { organization } = props;
  const hx_organizations_leaders_props =
    await hx_urls.organizations.leaders.$get({
      query: { siret: organization.siret },
    });

  return (
    <div class="mt-5 w-full bg-[#F6F6F6] p-3">
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}&whoWhat=Mairie`}
        class={`${button({ size: "sm", type: "tertiary" })} mr-2 bg-white `}
        rel="noopener noreferrer"
        target="_blank"
      >
        Chercher la mairie associée
      </a>
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}`}
        class={`${button({ size: "sm", type: "tertiary" })} mr-2 bg-white `}
        rel="noopener noreferrer"
        target="_blank"
      >
        Chercher les services publics associés
      </a>
      <a
        href={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${organization.siret.substring(0, 9)}`}
        class={`${button({ size: "sm", type: "tertiary" })} mr-2 bg-white `}
        rel="noopener noreferrer"
        target="_blank"
      >
        Liste dirigeants - Annuaire entreprise API
      </a>
      <a class="" {...hx_organizations_leaders_props} hx-trigger="load">
        <i class="text-center">Recherche des dirigeants...</i>
      </a>
    </div>
  );
}
