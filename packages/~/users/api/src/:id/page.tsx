//

import { hyper_ref } from "@~/app.core/html";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { button } from "@~/app.ui/button";
import { GoogleSearchButton } from "@~/app.ui/button/components";
import { copy_text_content_to_clipboard } from "@~/app.ui/button/scripts";
import { badge_description_list } from "@~/app.ui/list";
import { FrNumberConverter } from "@~/app.ui/number";
import { LocalTime } from "@~/app.ui/time";
import { hx_urls } from "@~/app.urls";
import { usePageRequestContext } from "./context";

//

export default async function User_Page() {
  const {
    var: { user },
  } = usePageRequestContext();
  const hx_get_user_organizations_props = await hx_urls.users[
    ":id"
  ].organizations.$get({
    param: { id: user.id.toString() },
    query: { describedby: hyper_ref(), page_ref: hyper_ref() },
  });
  const hx_get_user_moderations_props = await hx_urls.users[
    ":id"
  ].moderations.$get({
    param: { id: user.id.toString() },
  });

  return (
    <main>
      <div class="bg-(--background-alt-blue-france) py-6">
        <div class="fr-container py-6!">
          <h1>👨‍💻 A propos de l'utilisateur</h1>
          <div className="grid grid-cols-2 gap-4">
            <div class="fr-card p-6!">
              <h1 class="text-(--text-action-high-blue-france)">
                « {user.given_name} {user.family_name} »
              </h1>
              <Fiche />
            </div>
            <div class="fr-card p-6!">
              <AccountInfo />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="fr-container">
        <b>{user.given_name}</b> est enregistré(e) dans les organisations
        suivantes :
        <div class="fr-table max-w-full overflow-x-auto">
          <div
            {...hx_get_user_organizations_props}
            hx-target="this"
            hx-trigger="load"
            class="fr-table"
            id="table-user-organisations"
          ></div>
        </div>
        <hr />
        <b>{user.given_name}</b> est enregistré(e) dans les modérations
        suivantes :
        <div class="fr-table max-w-full overflow-x-auto">
          <div
            {...hx_get_user_moderations_props}
            hx-target="this"
            hx-trigger="load"
            class="fr-table"
            id="table-user-organisations"
          ></div>
        </div>
      </div>
      <div class="bg-(--background-alt-red-marianne) py-6">
        <div class="fr-container py-6">
          <Actions />
        </div>
      </div>
      <hr />
    </main>
  );
}

async function Actions() {
  const {
    var: { user },
  } = usePageRequestContext();

  const { id } = user;

  return (
    <div class="grid grid-cols-3 justify-items-center gap-1">
      <button
        class={button({ intent: "danger" })}
        {...await hx_urls.users[":id"].reset.email_verified.$patch({
          param: { id: id.toString() },
        })}
        hx-swap="none"
      >
        🚫 réinitialiser la vérification de l’email (bloquer)
      </button>
      <button
        class={button({ intent: "danger" })}
        hx-confirm={"Confirmez-vous la réinitialisation du mot de passe ?"}
        {...await hx_urls.users[":id"].reset.password.$patch({
          param: { id: id.toString() },
        })}
        hx-swap="none"
      >
        🔐 réinitialiser le mot de passe
      </button>
      <button
        class={button({ intent: "danger" })}
        hx-confirm={"Confirmez-vous la réinitialisation de la MFA ?"}
        {...await hx_urls.users[":id"].reset.mfa.$patch({
          param: { id: id.toString() },
        })}
        hx-swap="none"
      >
        📵 réinitialiser la MFA
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
  const { base, dd, dt } = badge_description_list();

  const $domain = hyper_ref();
  const $email = hyper_ref();

  const domain = z_email_domain.parse(user.email, { path: ["email"] });

  return (
    <dl class={base({ className: "grid-cols-[100px_1fr]" })}>
      <dt class={dt()}>id</dt>
      <dd class={dd()}>
        <b>{user.id}</b>
      </dd>

      <dt class={dt()}>email</dt>
      <dd class={dd()}>
        <b id={$email}> {user.email} </b>
        <button
          aria-hidden="true"
          class="fr-p-O leading-none"
          title="Copier l'email"
          _={copy_text_content_to_clipboard(`#${$email}`)}
        >
          <span
            aria-hidden="true"
            class="fr-icon-device-line"
            style={{ color: "var(--text-disabled-grey)" }}
          />
        </button>
      </dd>

      <dt class={dt()}>domain</dt>
      <dd class={dd()}>
        <b id={$domain}> {domain} </b>
        <button
          aria-hidden="true"
          class="fr-p-O leading-none"
          title="Copier le nom de domaine"
          _={copy_text_content_to_clipboard(`#${$domain}`)}
        >
          <span
            aria-hidden="true"
            class="fr-icon-device-line"
            style={{ color: "var(--text-disabled-grey)" }}
          />
        </button>

        <GoogleSearchButton
          class={button({ class: "align-bottom", size: "sm" })}
          query={domain}
        >
          Vérifier le nom de domaine
        </GoogleSearchButton>
      </dd>

      <dt class={dt()}>prénom</dt>
      <dd class={dd()}>
        <b>{user.given_name}</b>
      </dd>

      <dt class={dt()}>nom</dt>
      <dd class={dd()}>
        <b>{user.family_name}</b>
      </dd>

      <dt class={dt()}>téléphone</dt>
      <dd class={dd()}>
        <b>{user.phone_number}</b>
      </dd>

      <dt class={dt()}>fonction</dt>
      <dd class={dd()}>
        <b>{user.job}</b>
      </dd>
    </dl>
  );
}

function AccountInfo() {
  const {
    var: { user },
  } = usePageRequestContext();

  const { base, dd, dt } = badge_description_list();

  return (
    <dl class={base()}>
      <dt class={dt()}>Nombre de connection</dt>
      <dd class={dd()}>
        <b>{FrNumberConverter.format(user.sign_in_count)}</b>
      </dd>

      <dt class={dt()}>Création</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.created_at} />
        </b>
      </dd>

      <dt class={dt()}>Dernière connection</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.last_sign_in_at} />
        </b>
      </dd>

      <dt class={dt()}>Dernière modification</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.updated_at} />
        </b>
      </dd>

      <dt class={dt()}>Email vérifié</dt>
      <dd class={dd()}>
        <b>{user.email_verified ? "✅" : "❌"}</b>
      </dd>

      <dt class={dt()}>Email vérifié envoyé le</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.verify_email_sent_at} />
        </b>
      </dd>

      <dt class={dt()}>Demande de changement de mot de passe envoyé</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.reset_password_sent_at} />
        </b>
      </dd>

      <dt class={dt()}>TOTP vérifié envoyé le</dt>
      <dd class={dd()}>
        <b>
          <LocalTime date={user.totp_key_verified_at} />
        </b>
      </dd>
    </dl>
  );
}
