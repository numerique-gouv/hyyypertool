//

import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { button } from "@~/app.ui/button";
import { CopyButton } from "@~/app.ui/button/components/copy";
import { GoogleSearchButton } from "@~/app.ui/button/components/search";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { urls } from "@~/app.urls";
import { useContext, type JSX } from "hono/jsx";
import { ModerationPage_Context } from "./context";

//

export function About_User() {
  const {
    moderation: { created_at: moderation_created_at, user },
  } = useContext(ModerationPage_Context);

  const domain = z_email_domain.parse(user.email, { path: ["user.email"] });

  return (
    <section>
      <h3>
        <a
          href={
            urls.users[":id"].$url({ param: { id: user.id.toString() } })
              .pathname
          }
        >
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
          fonction : <b>{user.job}</b>
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
    </section>
  );
}

export function Investigation_User(props: JSX.IntrinsicElements["section"]) {
  const {
    moderation: { user, organization },
  } = useContext(ModerationPage_Context);

  const domain = z_email_domain.parse(user.email, { path: ["user.email"] });

  return (
    <section {...props}>
      <h4>🕵️ Enquête sur ce profile</h4>

      <ul class="list-none pl-0">
        <li>
          <GoogleSearchButton
            class={button({ size: "sm", type: "tertiary" })}
            query={user.email}
          >
            Résultats Google pour cet email
          </GoogleSearchButton>
        </li>
        <li>
          <GoogleSearchButton
            class={button({ size: "sm", type: "tertiary" })}
            query={domain}
          >
            Résultats Google pour ce nom de domaine
          </GoogleSearchButton>
        </li>
        <li>
          <GoogleSearchButton
            class={button({ size: "sm", type: "tertiary" })}
            query={`${organization.cached_libelle} ${domain}`}
          >
            Résultats Google pour le nom de l'organisation et le nom de domaine
          </GoogleSearchButton>
        </li>
      </ul>
    </section>
  );
}
