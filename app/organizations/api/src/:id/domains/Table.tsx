//

import { button } from "@~/app.ui/button";
import { GoogleSearchButton } from "@~/app.ui/button/components";
import { menu_item } from "@~/app.ui/menu";
import { Horizontal_Menu } from "@~/app.ui/menu/components";
import { LocalTime } from "@~/app.ui/time";
import { hx_urls } from "@~/app.urls";
import type { EmailDomain_Type } from "@~/identite-proconnect.lib/email_domain";
import type { MCP_EmailDomain_Type } from "@~/identite-proconnect.lib/identite-proconnect.d";
import type { get_orginization_domains_dto } from "@~/organizations.repository/get_orginization_domains";
import { match } from "ts-pattern";
import { AddDomainParams_Schema, usePageRequestContext } from "./context";

//

export function Table() {
  const {
    req,
    var: { domains },
  } = usePageRequestContext();
  const { describedby } = req.valid("query");

  return (
    <div class="fr-table *:table!">
      <table aria-describedby={describedby}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Domain</th>
            <th>Type</th>
            <th>Vérifié le</th>
            <th>Crée le</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain) => (
            <Row key={`${domain.id}`} organization_domain={domain} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colspan={6}>
              <Add_Domain />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

async function Add_Domain() {
  const { req } = usePageRequestContext();
  const { id: organization_id } = req.valid("param");

  const hx_add_domain_props = await hx_urls.organizations[":id"].domains.$put({
    param: {
      id: organization_id,
    },
  });

  return (
    <form
      {...hx_add_domain_props}
      hx-swap="none"
      class="grid grid-cols-[1fr_min-content]"
    >
      <input
        class="fr-input"
        type="text"
        name={AddDomainParams_Schema.keyof().Enum.domain}
      />
      <button class="fr-btn" type="submit">
        Ajouter
      </button>
    </form>
  );
}

function TypeToEmoji({ type }: { type: EmailDomain_Type }) {
  return match(type)
    .with("authorized", () => (
      <span role="img" aria-label="autorisé" title="autorisé">
        🔓
      </span>
    ))
    .with("blacklisted", () => (
      <span role="img" aria-label="blacklisté" title="blacklisté">
        ☠️
      </span>
    ))
    .with("external", () => (
      <span role="img" aria-label="externe" title="externe">
        ❎
      </span>
    ))
    .with("official_contact", () => (
      <span role="img" aria-label="contact officiel" title="contact officiel">
        ✅
      </span>
    ))
    .with("refused", () => (
      <span role="img" aria-label="postal mail" title="postal mail">
        🚫
      </span>
    ))
    .with("trackdechets_postal_mail", () => (
      <span role="img" aria-label="postal mail" title="postal mail">
        ✅
      </span>
    ))
    .with("verified", () => (
      <span role="img" aria-label="vérifié" title="vérifié">
        ✅
      </span>
    ))
    .otherwise(() => (
      <span role="img" aria-label="inconnu" title="inconnu">
        ❓
      </span>
    ));
}

function Row({
  key,
  organization_domain,
}: {
  key?: string;
  organization_domain: get_orginization_domains_dto[number];
}) {
  const {
    created_at,
    domain,
    organization,
    updated_at,
    verification_type,
    verified_at,
  } = organization_domain;
  return (
    <tr key={key}>
      <td>
        <TypeToEmoji type={verification_type as MCP_EmailDomain_Type} />
      </td>
      <td>{domain}</td>
      <td>{verification_type}</td>
      <td>
        <LocalTime date={verified_at} />
      </td>
      <td>
        <LocalTime date={created_at} />
        {created_at !== updated_at ? (
          <>
            <br />
            Modifié le <LocalTime date={updated_at} />
          </>
        ) : null}
      </td>
      <td class="space-x-2 text-end!">
        <GoogleSearchButton
          class={button({ class: "align-bottom", size: "sm" })}
          query={domain}
        >
          Vérifier le nom de domaine
        </GoogleSearchButton>
        <GoogleSearchButton
          class={button({ class: "align-bottom", size: "sm" })}
          query={`${organization.cached_libelle} ${domain}`}
        >
          Vérifier le matching
        </GoogleSearchButton>
        <Row_Actions organization_domain={organization_domain} />
      </td>
    </tr>
  );
}

async function Row_Actions({
  organization_domain,
}: {
  organization_domain: get_orginization_domains_dto[number];
}) {
  const { domain, id, organization, organization_id } = organization_domain;

  const hx_change_type_props = (type: MCP_EmailDomain_Type) =>
    hx_urls.organizations[":id"].domains[":domain_id"].$patch({
      param: { id: organization_id.toString(), domain_id: id.toString() },
      query: { type },
    });

  const hx_delete_domain_props = await hx_urls.organizations[":id"].domains[
    ":domain_id"
  ].$delete({
    param: { id: organization_id.toString(), domain_id: id.toString() },
  });

  return (
    <Horizontal_Menu>
      <ul class="list-none p-0">
        <li>
          <button
            {...await hx_change_type_props("verified")}
            class={menu_item()}
            hx-swap="none"
            role="menuitem"
          >
            ✅ Domaine autorisé
          </button>
        </li>
        <li>
          <button
            {...await hx_change_type_props("external")}
            class={menu_item()}
            hx-swap="none"
            role="menuitem"
          >
            ❎ Domaine externe
          </button>
        </li>
        <li>
          <button
            {...await hx_change_type_props("refused")}
            class={menu_item()}
            hx-swap="none"
            role="menuitem"
          >
            🚫 Domaine refusé
          </button>
        </li>
        <li>
          <button
            {...hx_delete_domain_props}
            class={menu_item()}
            hx-confirm={`Êtes-vous sûr de vouloir supprimer le domaine « ${domain} » de l'organisation « ${organization.cached_libelle} » ?`}
            hx-swap="none"
            role="menuitem"
          >
            🗑️ Supprimer
          </button>
        </li>
      </ul>
    </Horizontal_Menu>
  );
}
