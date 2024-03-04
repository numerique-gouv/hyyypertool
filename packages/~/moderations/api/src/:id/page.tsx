//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { hx_urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { schema } from "@~/moncomptepro.database";
import { and, eq } from "drizzle-orm";
import { useContext, type PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { _02 } from "./02";
import { _03 } from "./03";
import { About_Organisation } from "./About_Organisation";
import { About_User } from "./About_User";
import { Domain_Organization } from "./Domain_Organization";
import { Header } from "./Header";
import { Organization_Members_Table } from "./Organization_Members_Table";
import { ModerationPage_Context } from "./context";
import { Moderation_NotFound } from "./not-found";

//

export default async function Moderation_Page() {
  const { moderation } = useContext(ModerationPage_Context);

  return (
    <main
      class="fr-container my-12"
      hx-disinherit="*"
      {...hx_urls.moderations[":id"].$get(
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

      <Organization_Members_Table />

      <hr class="my-12" />

      <Domain_Organization />

      <_02 />

      <hr />

      <_03 />
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

  const moderation = await moncomptepro_pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, moderation_id),
    with: {
      organizations: true,
      users: true,
    },
  });

  if (!moderation) {
    status(404);
    return <Moderation_NotFound moderation_id={moderation_id} />;
  }

  const users_organizations =
    await moncomptepro_pg.query.users_organizations.findFirst({
      where: and(
        eq(schema.users_organizations.user_id, moderation.user_id),
        eq(
          schema.users_organizations.organization_id,
          moderation.organization_id,
        ),
      ),
    });

  const domain = z_email_domain.parse(moderation.users.email, {
    path: ["moderation.users.email"],
  });

  return (
    <ModerationPage_Context.Provider
      value={{ moderation, domain, users_organizations }}
    >
      {children}
    </ModerationPage_Context.Provider>
  );
}
