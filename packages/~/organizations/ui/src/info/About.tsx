//

import { button } from "@~/app.ui/button";
import { urls } from "@~/app.urls";
import type { GetFicheOrganizationByIdHandler } from "@~/organizations.lib/usecase";
import { type JSX } from "hono/jsx";
import { InactiveWarning } from "./InactiveWarning";

//

type Props = JSX.IntrinsicElements["section"] & {
  organization: Awaited<ReturnType<GetFicheOrganizationByIdHandler>>;
};

export function About(props: Props) {
  const { organization, moderation, ...section_props } = props;

  return (
    <section class="mt-6" {...section_props}>
      <h3>
        <a
          class="bg-none"
          target="_blank"
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
      <InactiveWarning organization={organization} />
      <div class="border border-gray-300 bg-white">
        <div class="grid grid-cols-[200px_1px_1fr] items-center gap-4">
          <div class="flex flex-col gap-3 text-gray-700">
            <div>DÉNOMINATION</div>
            <div>SIRET</div>
            <div>NAF/APE</div>
            <div>ADRESSE</div>
            <div>NATURE JURIDIQUE</div>
            <div>TRANCHE D'EFFECTIF</div>
          </div>

          <div class="h-full w-[1px] bg-gray-400"></div>

          <div class="flex flex-col gap-3 font-medium text-gray-900">
            <div>{organization.cached_libelle}</div>
            <div>
              {organization.siret}
              <a
                href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${organization.siret}`}
                class={`${button({ size: "sm", type: "tertiary" })} ml-2`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Fiche annuaire
              </a>
            </div>
            <div>{organization.cached_libelle_activite_principale}</div>
            <div>{organization.cached_adresse}</div>
            <div>
              {organization.cached_libelle_categorie_juridique} (
              {organization.cached_categorie_juridique})
            </div>
            <div>
              {organization.cached_libelle_tranche_effectif} (code :{" "}
              {organization.cached_tranche_effectifs}) (
              <a
                href="https://www.sirene.fr/sirene/public/variable/tefen"
                rel="noopener noreferrer"
                target="_blank"
              >
                liste code effectif INSEE
              </a>
              )
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
