//

import { prisma } from ":database";
import env from ":env";
import type { MCP_Moderation } from ":moncomptepro";
import { button } from ":ui/button";
import type { moderations, organizations, users } from "@prisma/client";
import lodash_sortby from "lodash.sortby";
import queryString from "query-string";
import { match } from "ts-pattern";

//

export async function _02({ moderation_id }: { moderation_id: number }) {
  const moderation = await prisma.moderations.findUniqueOrThrow({
    include: { organizations: true, users: true },
    where: { id: moderation_id },
  });

  const domain = moderation.users.email.split("@")[1];

  return (
    <div class="mx-auto mt-6 !max-w-6xl" id="02">
      <h1>🗃️ 2. Je consulte les données relative au cas à l'étude</h1>
      <div
        hx-get="/legacy/_/02/duplicate_warning"
        hx-trigger="load"
        hx-vals={JSON.stringify({
          organization_id: moderation.organization_id,
          user_id: moderation.user_id,
        })}
      >
        Demande multiples ?
      </div>
      <hr />
      <h2>
        🤗 <span>{moderation.users.given_name}</span>{" "}
        <span class="text-gray-600">
          {match(moderation.type as MCP_Moderation["type"])
            .with("ask_for_sponsorship", () => "demande un sponsorship")
            .with(
              "non_verified_domain",
              () => "a rejoint une organisation avec un domain non vérifié  ",
            )
            .with(
              "organization_join_block",
              () => "veut rejoindre l'organisation",
            )
            .otherwise(
              (type) => `veut effectuer une action inconnue (type ${type})`,
            )}
        </span>{" "}
        « <span>{moderation.organizations.cached_libelle}</span> »
      </h2>
      <div>
        <a
          class={button()}
          href={datapass_from_email(moderation.users.email)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>
            Voir les demandes DataPass déposées par{" "}
            {moderation.users.given_name}
          </span>
        </a>
        <br />
        <button
          _="
          on click
            set text to @data-email
            js(me, text)
              if ('clipboard' in window.navigator) {
                navigator.clipboard.writeText(text)
              }
            end"
          class={button()}
          data-email={moderation.users.email}
        >
          📋 Copier l'email
        </button>

        <a
          href={google_search(moderation.users.email)}
          class={button()}
          rel="noopener noreferrer"
          target="_blank"
        >
          🔍 Rechercher l'email
        </a>

        <button
          _="
          on click
            set text to @data-email
            js(me, text)
              if ('clipboard' in window.navigator) {
                navigator.clipboard.writeText(text)
              }
            end"
          class={button()}
          data-email={domain}
        >
          📋 Copier le domaine
        </button>

        <a
          href={google_search(domain)}
          class={button()}
          rel="noopener noreferrer"
          target="_blank"
        >
          🔍 Rechercher le domaine
        </a>

        <Search_Domain
          domain={domain}
          organization={moderation.organizations}
        />

        <div class="mt-5 block">
          <About_Organisation moderation={moderation} />
        </div>
      </div>
      <div>
        <div class="my-3">
          <Edit_Domain organization={moderation.organizations} />
        </div>
      </div>
      <br />
      <hr />
      <br />
      <h3>Membres enregistrés dans cette organisation :</h3>
      <div
        hx-get={`/legacy/organizations/${moderation.organization_id}/members`}
        hx-target="this"
        hx-trigger="load"
        class="fr-table"
        id="table-organisation-members"
      ></div>
      <hr />
      <h3 class="mt-2">
        #### 👨‍💻 A propos de <span>{moderation.users.given_name}</span>
      </h3>
      <ul>
        <li>
          id : <b>{moderation.user_id}</b>
        </li>
        <li>
          email : <b>{moderation.users.email}</b>
        </li>
        <li>
          prénom : <b>{moderation.users.given_name}</b>
        </li>
        <li>
          nom : <b>{moderation.users.family_name}</b>
        </li>
        <li>
          téléphone : <b>{moderation.users.phone_number}</b>
        </li>
        <li>
          poste : <b>{moderation.users.job}</b>
        </li>
        <li>
          nombre de connection : <b>{moderation.users.sign_in_count}</b>
        </li>
      </ul>
      <b>{moderation.users.given_name}</b> est enregistré(e) dans les
      organisations suivantes :
      <div class="fr-table max-w-full overflow-x-auto">
        <div
          hx-get={`/legacy/users/${moderation.user_id}/organizations`}
          hx-target="this"
          hx-trigger="load"
          class="fr-table"
        ></div>
      </div>
      <h3>### Détails de l'organisation sélectionnée ci-dessus :</h3>
      <ul>
        <li>
          Dénomination : <b>{moderation.organizations.cached_libelle}</b>
        </li>
        <li>
          Tranche d'effectif :{" "}
          <b>
            {moderation.organizations.cached_libelle_tranche_effectif} (code :{" "}
            {moderation.organizations.cached_tranche_effectifs}) (
            <a
              href="https://www.sirene.fr/sirene/public/variable/tefen"
              rel="noopener noreferrer"
              target="_blank"
            >
              liste code effectif INSEE
            </a>
            )
          </b>
        </li>
        <li>
          État administratif :{" "}
          <b>{moderation.organizations.cached_etat_administratif}</b> (
          <a
            href="https://www.sirene.fr/sirene/public/variable/etatAdministratifEtablissement"
            target="_blank"
            rel="noopener noreferrer"
          >
            liste état administratif INSEE
          </a>
          )
        </li>
      </ul>
    </div>
  );
}

export async function Edit_Domain({
  organization,
}: {
  organization: organizations;
}) {
  return (
    <div class="grid grid-cols-2">
      <div
        class="fr-table"
        hx-get={`/legacy/organizations/${organization.id}/domains/internal`}
        hx-trigger="load, organisation_internal_domain_updated from:body"
        id="edit-domain"
      ></div>
      <div
        class="fr-table"
        hx-get={`/legacy/organizations/${organization.id}/domains/external`}
        hx-trigger="load, organisation_external_domain_updated from:body"
        id="edit-domain"
      ></div>
    </div>
  );
}

export async function Duplicate_Warning({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}) {
  const moderationCount = await prisma.moderations.count({
    where: {
      organization_id,
      user_id,
    },
  });

  if (moderationCount <= 1) return <></>;

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s'agit de la {moderationCount}e demande pour cette organisation</p>
    </div>
  );
}

function Search_Domain({
  domain,
  organization,
}: {
  domain: string;
  organization: organizations;
}) {
  return (
    <>
      <a
        href={google_search(domain)}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        « <span>{domain}</span> » sur Google
      </a>
      <a
        href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${organization.siret}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        fiche Annuaire Entreprises
      </a>
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}&whoWhat=Mairie`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Mairie sur Annuaire Service Public
      </a>
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${organization.cached_code_postal}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Service sur Annuaire Service Public
      </a>
      <a
        href={`https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-annuaire-education/records?where=siren_siret%3D${organization.siret}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Établissement sur l'annuaire Éducation Nationale
      </a>
    </>
  );
}

function About_Organisation({
  moderation,
}: {
  moderation: moderations & { organizations: organizations; users: users };
}) {
  const domain = moderation.users.email.split("@")[1];
  return (
    <>
      <h3 class="mt-12"> 🏛 A propos de l'organisation</h3>
      <ul>
        <li>
          Dénomination : <b>{moderation.organizations.cached_libelle}</b>
        </li>
        <li>
          Activité principale de l’établissement (NAF/APE) :{" "}
          <b>{moderation.organizations.cached_libelle_activite_principale}</b>
        </li>
        <li>
          Nature juridique :{" "}
          <b>{moderation.organizations.cached_libelle_categorie_juridique}</b>
        </li>
        <li>
          Tranche d'effectif :{" "}
          <b>{moderation.organizations.cached_libelle_tranche_effectif}</b>{" "}
          (code :{" "}
          <span>{moderation.organizations.cached_tranche_effectifs}</span>) (
          <a
            href="https://www.sirene.fr/sirene/public/variable/tefen"
            target="_blank"
          >
            liste code effectif INSEE
          </a>
          )
        </li>
        <li>
          État administratif :{" "}
          <b>{moderation.organizations.cached_etat_administratif}</b> (
          <a
            href="https://www.sirene.fr/sirene/public/variable/etatAdministratifEtablissement"
            target="_blank"
          >
            liste état administratif INSEE
          </a>
          )
        </li>
      </ul>
      <ul>
        <li>
          id : <b>{moderation.organizations.id}</b>
        </li>
        <li>
          siret : <b>{moderation.organizations.siret}</b>
        </li>

        <div
          hx-get="/legacy/_/02/list_leaders"
          hx-trigger="load"
          hx-vals={JSON.stringify({
            siret: moderation.organizations.siret,
          })}
        >
          Liste des dirigeants...
        </div>
      </ul>
      <br />

      <button class={button({ className: "block", intent: "warning" })}>
        🪄 Action en un click :<br /> - ajouter le domaine <b>{domain}</b> dans
        les domaines internes (si pas déjà présent)
        <br /> - marquer ce domaine comme vérifié (si pas déjà vérifié)
        <br /> - marquer les membres existants de l'orga comme
        `verified_email_domain` (si pas de vérification effectuée)
      </button>
    </>
  );
}

interface Entreprise_API_Association_Response {
  data: {
    documents_rna: {
      annee_depot: string;
      date_depot: string;
      sous_type: {
        code: string;
      };
      url: string;
    }[];
  };
}

export async function List_Leaders({ siret }: { siret: string }) {
  const siren = siret.substring(0, 9);
  const query_params = new URLSearchParams({
    context: "Modération MonComptePro",
    object: "Modération MonComptePro",
    recipient: "13002526500013",
  });
  const response = await fetch(
    `https://entreprise.api.gouv.fr/v4/djepva/api-association/associations/${siren}?${query_params}`,
    {
      headers: {
        Authorization: `Bearer ${env.ENTREPRISE_API_GOUV_TOKEN}`,
      },
    },
  );
  const { data } =
    (await response.json()) as Entreprise_API_Association_Response;
  if (!data) return <></>;
  const docs = data.documents_rna;
  const sortedDocs = lodash_sortby(docs, ["annee_depot", "date_depot"]);
  const doc = sortedDocs.findLast(({ sous_type: { code } }) => code === "LDC");

  return doc ? (
    <a href={doc.url}>Liste des dirigeants</a>
  ) : (
    <>Pas de liste des dirigeants</>
  );
}

function datapass_from_email(email: string) {
  const query = queryString.stringify({
    sorted: JSON.stringify([{ id: "updated_at", desc: false }]),
    filtered: JSON.stringify([
      { id: "team_members.email", value: email },
      { id: "status", value: [] },
    ]),
  });
  return `https://datapass.api.gouv.fr/habilitations?${query}`;
}

function google_search(q: string) {
  const query = new URLSearchParams({ q });
  return `https://www.google.com/search?${query}`;
}
