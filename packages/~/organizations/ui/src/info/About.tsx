//

import { button } from "@~/app.ui/button";
import { description_list } from "@~/app.ui/list";
import { LocalTime } from "@~/app.ui/time";
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
      <dl class={description_list()}>
        <dt>Dénomination </dt>
        <dd>
          <abbr title={organization.cached_nom_complet ?? ""}>
            {organization.cached_libelle}
          </abbr>{" "}
        </dd>

        <dt>Siret </dt>
        <dd>
          {organization.siret}{" "}
          <a
            href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${organization.siret}`}
            class={`${button({ size: "sm", type: "tertiary" })} ml-2`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Fiche annuaire
          </a>
        </dd>

        <dt>NAF/APE </dt>
        <dd>{organization.cached_libelle_activite_principale} </dd>

        <dt>Adresse </dt>
        <dd>{organization.cached_adresse} </dd>

        <dt>Nature juridique </dt>
        <dd>
          {organization.cached_libelle_categorie_juridique} (
          {organization.cached_categorie_juridique})
        </dd>

        <dt>Tranche d effectif </dt>
        <dd>
          {organization.cached_libelle_tranche_effectif} (code :{" "}
          {organization.cached_tranche_effectifs}){" "}
          <span class="text-nowrap">
            (
            <a
              href="https://www.sirene.fr/sirene/public/variable/tefen"
              rel="noopener noreferrer"
              target="_blank"
            >
              liste code effectif INSEE
            </a>
            )
          </span>
        </dd>
      </dl>
      <details class="my-6">
        <summary>Détails de l'organisation</summary>
        <ul>
          <li>
            id : <b>{organization.id}</b>
          </li>
          <li>
            Création de l'organisation :{" "}
            <b>
              <LocalTime date={organization.created_at} />
            </b>
          </li>
          <li>
            Dernière mise à jour :{" "}
            <b>
              <LocalTime date={organization.updated_at} />
            </b>
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
