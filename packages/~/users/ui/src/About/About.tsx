//

import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { CopyButton } from "@~/app.ui/button/components/copy";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { urls } from "@~/app.urls";
import type { GetUserInfoOutput } from "@~/users.lib/usecase/GetUserInfo";

//

type AboutProps = {
  user: GetUserInfoOutput;
};

//

export function About({ user }: AboutProps) {
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
          Email : <b>{user.email}</b>
        </li>
        <li>
          Prénom : <b>{user.given_name}</b>
        </li>
        <li>
          Nom : <b>{user.family_name}</b>
        </li>
        <li>
          Téléphone : <b>{user.phone_number}</b>
        </li>
        <li>
          Profession : <b>{user.job}</b>
        </li>
      </ul>

      <CopyButton text={user.email} variant={{ size: "sm", type: "tertiary" }}>
        Copier l'email
      </CopyButton>
      <CopyButton text={domain} variant={{ size: "sm", type: "tertiary" }}>
        Copier le domaine
      </CopyButton>

      <details class="my-6">
        <summary>Détails du profile</summary>
        <ul>
          <li>
            id : <b>{user.id}</b>
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
            Nombre de connection : <b>{user.sign_in_count}</b>
          </li>
        </ul>
      </details>
    </section>
  );
}
