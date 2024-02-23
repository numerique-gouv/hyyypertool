//

import { button } from "@~/app.ui/button";
import { CopyButton } from "@~/app.ui/button/copy";
import { GoogleSearchButton } from "@~/app.ui/button/search";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { api_ref } from "@~/app.urls/legacy";
import { datapass_from_email } from "@~/moderations.lib/datapass_from_email";
import { useContext } from "hono/jsx";
import { ModerationPage_Context } from "./page";

//

export function About_User() {
  const {
    moderation: {
      created_at: moderation_created_at,
      users: user,
      organizations,
    },
  } = useContext(ModerationPage_Context);

  const domain = user.email.split("@")[1];

  return (
    <section>
      <h3>
        <a href={api_ref("/legacy/users/:id", { id: user.id.toString() })}>
          👨‍💻 Profile
        </a>
      </h3>

      <ul class="list-none pl-0">
        <li>
          id : <b>{user.id}</b>
        </li>
        <li>
          email : <b>{user.email}</b>
        </li>
        <li>
          prénom : <b>{user.given_name}</b>
        </li>
        <li>
          nom : <b>{user.family_name}</b>
        </li>
        <li>
          téléphone : <b>{user.phone_number}</b>
        </li>
        <li>
          poste : <b>{user.job}</b>
        </li>
        <li>
          nombre de connection : <b>{user.sign_in_count}</b>
        </li>
        <li>
          Dernière connexion :{" "}
          <b>
            <LocalTime date={user.last_sign_in_at} />
          </b>
        </li>
        <li>
          Creation de compte :{" "}
          <b>
            <LocalTime date={user.created_at} />
          </b>
        </li>
        <li>
          Demande de création :{" "}
          <b>
            <LocalTime date={moderation_created_at} />
          </b>
        </li>
      </ul>

      <CopyButton text={user.email} variant={{ size: "sm", type: "tertiary" }}>
        Copier l'email
      </CopyButton>
      <CopyButton text={domain} variant={{ size: "sm", type: "tertiary" }}>
        Copier le domaine
      </CopyButton>

      <hr class="bg-none" />

      <h4>🕵️ Enquête sur ce profil</h4>

      <ul class="list-none pl-0">
        <li>
          <GoogleSearchButton query={user.email}>
            Résultats Google pour cet email
          </GoogleSearchButton>
        </li>
        <li>
          <GoogleSearchButton query={domain}>
            Résultats Google pour ce nom de domaine
          </GoogleSearchButton>
        </li>
        <li>
          <GoogleSearchButton
            query={`${organizations.cached_libelle} ${domain}`}
          >
            Résultats Google pour le nom de l'organisation et le nom de domaine
          </GoogleSearchButton>
        </li>
        <li>
          <a
            class={button({ size: "sm", type: "tertiary" })}
            href={datapass_from_email(user.email)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>
              Voir les demandes DataPass déposées par {user.given_name}
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}