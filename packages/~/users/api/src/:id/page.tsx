//

import { hyper_ref } from "@~/app.core/html";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { button } from "@~/app.ui/button";
import { CopyButton } from "@~/app.ui/button/components/copy";
import { GoogleSearchButton } from "@~/app.ui/button/components/search";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls } from "@~/app.urls";
import { usePageRequestContext } from "./context";

//

export default async function User_Page() {
  const {
    var: { user },
  } = usePageRequestContext();
  const hx_get_user_organizations = await hx_urls.users[
    ":id"
  ].organizations.$get({
    param: { id: user.id.toString() },
    query: { describedby: hyper_ref() },
  });
  const hx_get_user_moderations = await hx_urls.users[":id"].moderations.$get({
    param: { id: user.id.toString() },
  });

  return (
    <main class="fr-container">
      <h1>👨‍💻 A propos de {user.given_name}</h1>
      <Fiche />
      <AccountInfo />
      <hr />
      <Actions />
      <br />
      <hr />
      <b>{user.given_name}</b> est enregistré(e) dans les organisations
      suivantes :
      <div class="fr-table max-w-full overflow-x-auto">
        <div
          {...hx_get_user_organizations}
          hx-target="this"
          hx-trigger="load"
          class="fr-table"
          id="table-user-organisations"
        ></div>
      </div>
      <hr />
      <b>{user.given_name}</b> est enregistré(e) dans les modérations suivantes
      :
      <div class="fr-table max-w-full overflow-x-auto">
        <div
          {...hx_get_user_moderations}
          hx-target="this"
          hx-trigger="load"
          class="fr-table"
          id="table-user-organisations"
        ></div>
      </div>
    </main>
  );
}

async function Actions() {
  const {
    var: { user },
  } = usePageRequestContext();

  const { email, id } = user;
  const domain = z_email_domain.parse(email, { path: ["email"] });
  return (
    <div class="grid grid-cols-3 justify-items-center gap-1">
      <CopyButton text={email}>Copier l'email</CopyButton>
      <CopyButton text={domain}>Copier le domain</CopyButton>
      <GoogleSearchButton query={domain}>
        « <span>{domain}</span> » sur Google
      </GoogleSearchButton>
      <button
        class={button({ intent: "danger" })}
        {...await hx_urls.users[":id"].reset.$patch({
          param: { id: id.toString() },
        })}
        hx-swap="none"
      >
        🚫 réinitialiser la vérification de l’email (bloquer)
      </button>
      <button
        class={button({ intent: "dark" })}
        hx-confirm={"Confirmez-vous la suppression de ce compte ?"}
        hx-swap="none"
        {...await hx_urls.users[":id"].$delete({
          param: { id: id.toString() },
        })}
      >
        🗑️ supprimer définitivement ce compte
      </button>
    </div>
  );
}

function Fiche() {
  const {
    var: { user },
  } = usePageRequestContext();

  return (
    <ul>
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
    </ul>
  );
}

function AccountInfo() {
  const {
    var: { user },
  } = usePageRequestContext();

  return (
    <ul>
      <li>
        nombre de connection : <b>{user.sign_in_count}</b>
      </li>
      <li>
        Création :{" "}
        <b>
          <LocalTime date={user.created_at} />
        </b>
      </li>
      <li>
        Dernière connectio :{" "}
        <b>
          <LocalTime date={user.last_sign_in_at} />
        </b>
      </li>
      <li>
        Dernière modif :
        <b>
          <LocalTime date={user.updated_at} />
        </b>
      </li>
      <li>
        Email vérifié : <b>{user.email_verified ? "✅" : "❌"}</b>
      </li>
      <li>
        mail de vérif envoyé :{" "}
        <b>
          <LocalTime date={user.verify_email_sent_at} />
        </b>
      </li>
      <li>
        mail chgmt mdp envoyé :{" "}
        <b>
          <LocalTime date={user.reset_password_sent_at} />
        </b>
      </li>
    </ul>
  );
}
