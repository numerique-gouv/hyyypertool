//

import { button } from "@~/app.ui/button";
import { CopyButton } from "@~/app.ui/button/components/copy";
import { GoogleSearchButton } from "@~/app.ui/button/components/search";
import { menu_item } from "@~/app.ui/menu";
import { Horizontal_Menu } from "@~/app.ui/menu/components/Horizontal_Menu";
import { hx_urls } from "@~/app.urls";
import type { MCP_EmailDomain_Type } from "@~/moncomptepro.lib/moncomptepro.d";
import type { get_orginization_domains_dto } from "@~/organizations.repository/get_orginization_domains";
import { match } from "ts-pattern";
import { AddDomainParams_Schema, usePageRequestContext } from "./context";

//

export function Table() {
  const {
    var: { domains },
  } = usePageRequestContext();

  return (
    <div class="fr-table [&>table]:table">
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Domain</th>
            <th>Type</th>
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
            <td colspan={4}>
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
        Add
      </button>
    </form>
  );
}

function TypeToEmoji({ type }: { type: MCP_EmailDomain_Type }) {
  return match(type)
    .with("verified", () => (
      <span role="img" aria-label="vérifié">
        ✅
      </span>
    ))
    .with("authorized", () => (
      <span role="img" aria-label="autorisé">
        🔓
      </span>
    ))
    .with("external", () => (
      <span role="img" aria-label="externe">
        ❌
      </span>
    ))
    .with("blacklisted", () => (
      <span role="img" aria-label="blacklisté">
        🚫
      </span>
    ))
    .with("official_contact", () => (
      <span role="img" aria-label="contact officiel">
        📞
      </span>
    ))
    .with("trackdechets_postal_mail", () => (
      <span role="img" aria-label="postal mail">
        📬
      </span>
    ))
    .otherwise(() => (
      <span role="img" aria-label="inconnu">
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
  const { domain, verification_type: type, organization } = organization_domain;
  return (
    <tr key={key}>
      <td>
        <TypeToEmoji type={type as MCP_EmailDomain_Type} />
      </td>
      <td>{domain}</td>
      <td>{type}</td>
      <td class="!text-end">
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
  const { domain, id, organization_id, organization } = organization_domain;

  const hx_delete_domain_props = await hx_urls.organizations[":id"].domains[
    ":domain_id"
  ].$delete({
    param: { id: organization_id.toString(), domain_id: id.toString() },
  });

  const hx_change_type_props = (type: MCP_EmailDomain_Type) =>
    hx_urls.organizations[":id"].domains[":domain_id"].$patch({
      param: { id: organization_id.toString(), domain_id: id.toString() },
      query: { type },
    });

  return (
    <Horizontal_Menu>
      <ul class="list-none p-0">
        <li>
          <CopyButton
            text={domain}
            variant={{
              type: "tertiary",
              class: menu_item({ class: "shadow-none" }),
            }}
          >
            Copier le domaine
          </CopyButton>
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
        <li>
          <GoogleSearchButton
            class={menu_item({ class: "bg-none" })}
            query={domain}
            role="menuitem"
            tabindex={-1}
          >
            Résultats Google pour ce nom de domaine
          </GoogleSearchButton>
        </li>
        <li>
          <GoogleSearchButton
            class={menu_item({ class: "bg-none" })}
            query={`${organization.cached_libelle} ${domain}`}
            role="menuitem"
            tabindex={-1}
          >
            Résultats Google pour le nom de l'organisation et le nom de domaine
          </GoogleSearchButton>
        </li>
        <li>
          <button
            {...await hx_change_type_props("verified")}
            class={menu_item()}
            hx-swap="none"
            role="menuitem"
          >
            🔄 Domain vérifié
          </button>
        </li>
        <li>
          <button
            {...await hx_change_type_props("authorized")}
            class={menu_item()}
            hx-swap="none"
            role="menuitem"
          >
            🔄 Domain autorisé
          </button>
        </li>
        <li>
          <button
            {...await hx_change_type_props("external")}
            class={menu_item()}
            hx-swap="none"
            role="menuitem"
          >
            🔄 Domain externe
          </button>
        </li>
      </ul>
    </Horizontal_Menu>
  );
}
