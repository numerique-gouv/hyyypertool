//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { hx_urls, urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { IsUserExternalMember } from "@~/moderations.lib/usecase/IsUserExternalMember";
import { Actions } from "@~/moderations.ui/Actions";
import { DomainsByOrganization } from "@~/moderations.ui/DomainsByOrganization";
import { Header } from "@~/moderations.ui/Header";
import { OrganizationsByUser } from "@~/moderations.ui/OrganizationsByUser";
import { UsersByOrganization } from "@~/moderations.ui/UsersByOrganization";
import { SuggestOrganizationDomains } from "@~/organizations.lib/usecase";
import { About as About_Organization } from "@~/organizations.ui/info/About";
import { Investigation as Investigation_Organization } from "@~/organizations.ui/info/Investigation";
import {
  CountUserMemberships,
  SuggestSameUserEmails,
} from "@~/users.lib/usecase";
import { About as About_User } from "@~/users.ui/About";
import { Investigation as Investigation_User } from "@~/users.ui/Investigation";
import { getContext } from "hono/context-storage";
import { type ModerationContext, usePageRequestContext } from "./context";
import { Moderation_Exchanges } from "./Moderation_Exchanges";

//

export default async function Moderation_Page() {
  const { moderation } = getContext<ModerationContext>().var;
  const { user } = moderation;
  const {
    var: {
      moncomptepro_pg,
      organization_fiche,
      query_domain_count,
      query_organization_members_count,
    },
  } = usePageRequestContext();

  return (
    <>
      <main
        class="fr-container my-12"
        hx-disinherit="*"
        {...await hx_urls.moderations[":id"].$get(
          {
            param: { id: moderation.id.toString() },
          },
          {},
        )}
        hx-select="main"
        hx-trigger={hx_trigger_from_body([
          MODERATION_EVENTS.Enum.MODERATION_UPDATED,
        ])}
      >
        <button
          _="on click go back"
          class={button({
            class: "fr-btn--icon-left fr-icon-checkbox-circle-line",
            type: "tertiary",
            size: "sm",
          })}
        >
          retour
        </button>
        <hr class="bg-none pt-6" />

        <Header.Provier value={{ moderation }}>
          <Header />
        </Header.Provier>

        <hr class="my-3" />

        <div class="grid grid-cols-2 gap-6">
          <About_User user={moderation.user} />
          <div>
            <h3>
              <a
                href={
                  urls.organizations[":id"].$url({
                    param: {
                      id: moderation.organization.id.toString(),
                    },
                  }).pathname
                }
              >
                🏛 Organisation
              </a>
            </h3>
            <About_Organization organization={organization_fiche} />
          </div>
        </div>

        <hr class="bg-none pt-6" />

        <div class="grid grid-cols-2 gap-6">
          <Investigation_User
            user={moderation.user}
            organization={moderation.organization}
          />
          <Investigation_Organization organization={moderation.organization} />
        </div>

        <hr class="bg-none pt-6" />

        <OrganizationsByUser
          user={moderation.user}
          query_organization_count={CountUserMemberships({
            pg: moncomptepro_pg,
          })}
        />
        <hr class="my-3" />

        <DomainsByOrganization
          organization={moderation.organization}
          query_domain_count={query_domain_count}
        />

        <hr class="my-3 bg-none" />

        <UsersByOrganization
          organization={moderation.organization}
          query_members_count={query_organization_members_count}
        />

        <hr class="my-3 bg-none" />

        <Actions
          value={{
            moderation,
            query_suggest_same_user_emails: SuggestSameUserEmails({
              pg: moncomptepro_pg,
            }),
            query_is_user_external_member: IsUserExternalMember({
              pg: moncomptepro_pg,
            }),
            query_suggest_organization_domains: SuggestOrganizationDomains({
              pg: moncomptepro_pg,
            }),
          }}
        />

        <hr class="my-3 bg-none" />

        <hr />

        <hr class="my-3 bg-none" />

        <Moderation_Exchanges />
      </main>

      <div class="fixed bottom-0 left-0 right-0 w-full shadow-lg">
        <div
          style="border: 1px solid var(--text-action-high-blue-france);"
          class="m-2 w-1/2 justify-self-end bg-[--blue-france-975-75] p-6"
          id="modal"
        >
          <div class="mb-4 flex items-center justify-between">
            <p class="mb-0 text-lg font-bold">✅ Accepter</p>
            <button
              class="fr-btn fr-icon-subtract-line  fr-btn--tertiary-no-outline"
              _={`
            on click
              add .hidden to #modal
          `}
            >
              Label bouton
            </button>
          </div>
          <p>
            A propos de 
            <span class="font-bold text-[--text-action-high-blue-france]">
              {user.email}
            </span>
            , je valide :
          </p>
        </div>
        <div class="fr-p-1w flex justify-end bg-[--blue-france-975-75]">
          <button
            class="fr-btn fr-mr-2w fr-btn--secondary bg-white"
            _={`
              on click
                remove .hidden from #modal
            `}
          >
            ✅ Accepter
          </button>

          <button class="fr-btn fr-mr-2w fr-btn--secondary bg-white">
            ❌ Refuser
          </button>
          <a
            href="#exchange_moderation"
            class="fr-btn fr-btn--secondary bg-white"
            onclick="document.getElementById('exchange_details').setAttribute('open', ''); return true;"
          >
            💬 Voir les échanges
          </a>
        </div>
      </div>
    </>
  );
}
