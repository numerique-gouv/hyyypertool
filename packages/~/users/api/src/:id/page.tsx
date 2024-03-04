//

import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { CopyButton } from "@~/app.ui/button/components/copy";
import { GoogleSearchButton } from "@~/app.ui/button/components/search";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls } from "@~/app.urls";
import { get_user_by_id } from "@~/users.repository/get_user_by_id";
import { useContext, type PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import UserPage_Context from "./context";
import { User_NotFound } from "./not-found";

//

export default function User_Page() {
  const { user } = useContext(UserPage_Context);
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
          {...hx_urls.users[":id"].organizations.$get({
            param: { id: user.id.toString() },
            query: {},
          })}
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
          {...hx_urls.users[":id"].moderations.$get({
            param: { id: user.id.toString() },
          })}
          hx-target="this"
          hx-trigger="load"
          class="fr-table"
          id="table-user-organisations"
        ></div>
      </div>
    </main>
  );
}

function Actions() {
  const { user } = useContext(UserPage_Context);
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
        {...hx_urls.users[":id"].reset.$patch({ param: { id: id.toString() } })}
        hx-swap="none"
      >
        🚫 réinitialiser la vérification de l’email (bloquer)
      </button>
      <button
        class={button({ intent: "dark" })}
        {...hx_urls.users[":id"].$delete({ param: { id: id.toString() } })}
        hx-swap="none"
      >
        🗑️ supprimer définitivement ce compte
      </button>
    </div>
  );
}

function Fiche() {
  const { user } = useContext(UserPage_Context);
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
        poste : <b>{user.job}</b>
      </li>
    </ul>
  );
}

function AccountInfo() {
  const { user } = useContext(UserPage_Context);
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

//

export { UserPage_Context };

//

export async function UserPage_Provider({
  value: { id },
  children,
}: PropsWithChildren<{ value: { id: number } }>) {
  const {
    status,
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const user = await get_user_by_id(moncomptepro_pg, { id });

  if (!user) {
    status(404);
    return <User_NotFound user_id={id} />;
  }

  return (
    <UserPage_Context.Provider value={{ user }}>
      {children}
    </UserPage_Context.Provider>
  );
}
