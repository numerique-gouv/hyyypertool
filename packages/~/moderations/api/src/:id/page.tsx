//

import { NotFoundError } from "@~/app.core/error";
import { hx_trigger_from_body } from "@~/app.core/htmx";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { to } from "await-to-js";
import { useContext, type PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import {
  About_Organisation,
  Investigation_Organisation,
} from "./About_Organisation";
import { About_User, Investigation_User } from "./About_User";
import { Moderation_Actions } from "./Actions";
import { Domain_Organization } from "./Domain_Organization";
import { Header } from "./Header";
import { Members_Of_Organization_Table } from "./Members_Of_Organization_Table";
import { Moderation_Exchanges } from "./Moderation_Exchanges";
import { Organizations_Of_User_Table } from "./Organizations_Of_User_Table";
import {
  ModerationPage_Context,
  get_moderation,
  get_organization_member,
} from "./context";
import { Moderation_NotFound } from "./not-found";

//

export default async function Moderation_Page() {
  const { moderation } = useContext(ModerationPage_Context);

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
        <About_Organisation />
      </div>

      <hr class="bg-none pt-6" />

      <div class="grid grid-cols-2 gap-6">
        <Investigation_User />
        <Investigation_Organisation />
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

//

export async function ModerationPage_Provider({
  moderation_id,
  children,
}: PropsWithChildren<{
  moderation_id: number | undefined;
}>) {
  const {
    status,
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  if (!moderation_id) {
    status(404);
    return <Moderation_NotFound />;
  }

  const [moderation_error, moderation] = await to(
    get_moderation({ pg: moncomptepro_pg }, { moderation_id }),
  );

  if (moderation_error instanceof NotFoundError) {
    status(404);
    return <Moderation_NotFound moderation_id={moderation_id} />;
  } else if (moderation_error) {
    throw moderation_error;
  }

  const organization_member = await get_organization_member(
    { pg: moncomptepro_pg },
    {
      organization_id: moderation.organization_id,
      user_id: moderation.user.id,
    },
  );

  const domain = z_email_domain.parse(moderation.user.email, {
    path: ["moderation.users.email"],
  });

  return (
    <ModerationPage_Context.Provider
      value={{ moderation, domain, organization_member }}
    >
      {children}
    </ModerationPage_Context.Provider>
  );
}
