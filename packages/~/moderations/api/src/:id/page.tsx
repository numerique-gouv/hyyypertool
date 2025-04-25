//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
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
  const {
    var: {
      moncomptepro_pg,
      organization_fiche,
      query_domain_count,
      query_organization_members_count,
    },
  } = usePageRequestContext();

  return (
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
          class: "fr-btn--icon-left fr-icon-arrow-go-back-fill",
          type: "tertiary",
          size: "sm",
        })}
      >
        retour
      </button>

      <hr class="bg-none pb-5" />

      <Header.Provier value={{ moderation }}>
        <Header />
      </Header.Provier>

      <hr class="bg-none pb-5" />

      <About_User user={moderation.user} />
      <Investigation_User
        user={moderation.user}
        organization={moderation.organization}
      />
      <About_Organization organization={organization_fiche} />
      <Investigation_Organization organization={moderation.organization} />

      <hr class="bg-none" />

      <DomainsByOrganization
        organization={moderation.organization}
        query_domain_count={query_domain_count}
      />
      <OrganizationsByUser
        user={moderation.user}
        query_organization_count={CountUserMemberships({ pg: moncomptepro_pg })}
      />

      <UsersByOrganization
        organization={moderation.organization}
        query_members_count={query_organization_members_count}
      />

      <hr class="bg-none" />

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

      <hr class="bg-none" />

      <hr />

      <hr class="bg-none" />

      <Moderation_Exchanges />
    </main>
  );
}
