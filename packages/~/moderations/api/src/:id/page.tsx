//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { hx_urls, urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { About as About_Organization } from "@~/organizations.ui/info/About";
import { Investigation as Investigation_Organization } from "@~/organizations.ui/info/Investigation";
import { getContext } from "hono/context-storage";
import { About_User, Investigation_User } from "./About_User";
import { Moderation_Actions } from "./Actions";
import { Domain_Organization } from "./Domain_Organization";
import { Header } from "./Header";
import { Members_Of_Organization_Table } from "./Members_Of_Organization_Table";
import { Moderation_Exchanges } from "./Moderation_Exchanges";
import { Organizations_Of_User_Table } from "./Organizations_Of_User_Table";
import { type ModerationContext, usePageRequestContext } from "./context";

//

export default async function Moderation_Page() {
  const { moderation } = getContext<ModerationContext>().var;
  const {
    var: { organization_fiche },
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
          class: "fr-btn--icon-left fr-icon-checkbox-circle-line",
          type: "tertiary",
          size: "sm",
        })}
      >
        retour
      </button>

      <hr class="bg-none pt-6" />

      <Header />

      <hr class="my-12" />

      <div class="grid grid-cols-2 gap-6">
        <About_User />
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
        <Investigation_User />
        <Investigation_Organization organization={moderation.organization} />
      </div>

      <hr class="bg-none pt-6" />

      <Organizations_Of_User_Table />

      <hr class="my-12" />

      <Domain_Organization />

      <hr class="my-12 bg-none" />

      <Members_Of_Organization_Table />

      <hr class="my-12 bg-none" />

      <Moderation_Actions />

      <hr class="my-12 bg-none" />

      <hr />

      <hr class="my-12 bg-none" />

      <Moderation_Exchanges />
    </main>
  );
}
