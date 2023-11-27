//

import { prisma } from ":database";
import { button } from ":ui/button";
import queryString from "query-string";
import { match } from "ts-pattern";

//

export async function _02({ moderation_id }: { moderation_id: number }) {
  const moderation = await prisma.moderations.findUniqueOrThrow({
    include: { organizations: true, users: true },
    where: { id: moderation_id },
  });

  const domain = moderation.users.email.split("@")[1];
  const moderationCount = await prisma.moderations.count({
    where: {
      organization_id: moderation.organization_id,
      user_id: moderation.user_id,
    },
  });
  return (
    <div class="mx-auto mt-6 !max-w-4xl" id="02">
      <h1>🗃️ 2. Je consulte les données relative au cas à l'étude</h1>
      {moderationCount > 1 ? (
        <div class="fr-alert fr-alert--warning">
          <h3 class="fr-alert__title">Attention : demande multiples</h3>
          <p>
            Il s'agit de la {moderationCount}e demande pour cette organisation
          </p>
        </div>
      ) : null}
      <hr />
      <h2>
        🤗 <span safe>{moderation.users.given_name}</span>{" "}
        <span safe>
          {match(moderation.type as Moderation["type"])
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
        « <span safe>{moderation.organizations.cached_libelle}</span> »
      </h2>
      <a
        href={datapass_from_email(moderation.users.email)}
        rel="noopener noreferrer"
        target="_blank"
      >
        Voir les demandes DataPass déposées par{" "}
        <span safe>{moderation.users.given_name}</span>
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
      <br />
      <a
        href={google_search(domain)}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        « <span safe>{domain}</span> » sur Google
      </a>
      <br />
      <a
        href={`https://annuaire-entreprises.data.gouv.fr/etablissement/${moderation.organizations.siret}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        fiche Annuaire Entreprises
      </a>
      <br />
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${moderation.organizations.cached_code_postal}&whoWhat=Mairie`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Mairie sur Annuaire Service Public
      </a>
      <br />
      <a
        href={`https://lannuaire.service-public.fr/recherche?where=${moderation.organizations.cached_code_postal}`}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Service sur Annuaire Service Public
      </a>
      <br />
      <a
        href={`https://data.education.gouv.fr/api/v2/catalog/datasets/fr-en-annuaire-education/records?where=siren_siret%3D${moderation.organizations.siret}  `}
        class={button()}
        rel="noopener noreferrer"
        target="_blank"
      >
        Établissement sur l'annuaire Éducation Nationale
      </a>
      <h3>#### 🏛 A propos de l'organisation</h3>
      <ul>
        <li>
          Dénomination : <b safe>{moderation.organizations.cached_libelle}</b>
        </li>
        <li>
          Activité principale de l’établissement (NAF/APE) :{" "}
          <b safe>
            {moderation.organizations.cached_libelle_activite_principale}
          </b>
        </li>
        <li>
          Nature juridique :{" "}
          <b safe>
            {moderation.organizations.cached_libelle_categorie_juridique}
          </b>
        </li>
        <li>
          Tranche d'effectif :{" "}
          <b safe>{moderation.organizations.cached_libelle_tranche_effectif}</b>{" "}
          (code :{" "}
          <span safe>{moderation.organizations.cached_tranche_effectifs}</span>)
          (
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
          <b safe>{moderation.organizations.cached_etat_administratif}</b> (
          <a
            href="https://www.sirene.fr/sirene/public/variable/etatAdministratifEtablissement"
            target="_blank"
          >
            liste état administratif INSEE
          </a>
          )
        </li>
      </ul>
      <hr />
      <ul>
        <li>
          id : <b>{moderation.organizations.id}</b>
        </li>
        <li>
          siret : <b safe>{moderation.organizations.siret}</b>
        </li>
      </ul>
      <hr />
      {/* <div
        hx-get={`/dashboard/_/organizations/${moderation.organization_id}/members`}
        hx-target="this"
        hx-trigger="load"
      ></div> */}
      <hr />
      <h3>
        #### 👨‍💻 A propos de <span safe>{moderation.users.given_name}</span>
      </h3>
      <ul>
        <li>
          id : <b>{moderation.user_id}</b>
        </li>
        <li>
          email : <b safe>{moderation.users.email}</b>
        </li>
        <li>
          prénom : <b safe>{moderation.users.given_name}</b>
        </li>
        <li>
          nom : <b safe>{moderation.users.family_name}</b>
        </li>
        <li>
          téléphone : <b safe>{moderation.users.phone_number}</b>
        </li>
        <li>
          poste : <b safe>{moderation.users.job}</b>
        </li>
        <li>
          nombre de connection : <b>{moderation.users.sign_in_count}</b>
        </li>
      </ul>
      <b safe>{moderation.users.given_name}</b> est enregistré(e) dans les
      organisations suivantes :
      <div class="fr-table max-w-full overflow-x-auto">
        <table>
          <thead>
            <tr>
              {[
                "siret",
                "cached_libelle",
                "Interne",
                "verified_email_domains",
                "authorized_email_domains",
                "external_authorized_email_domains",
                "cached_code_officiel_geographique",
                "authentication_by_peers_type",
                "has_been_greeted",
                "sponsor_id",
                "needs_official_contact_email_verification",
                "official_contact_email_verification_token",
                "official_contact_email_verification_sent_at",
              ].map((name) => (
                <th safe>{name}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
              <td>...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
