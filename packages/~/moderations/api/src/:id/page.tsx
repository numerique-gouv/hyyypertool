//

import { hx_trigger_from_body } from "@~/app.core/htmx";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { schema } from "@~/moncomptepro.database";
import { and, eq } from "drizzle-orm";
import { useRequestContext } from "hono/jsx-renderer";
import { _02 } from "./02";
import { _03 } from "./03";
import { About_Organisation } from "./About_Organisation";
import { About_User } from "./About_User";
import { Header } from "./Header";
import ModerationPage_Context from "./context";

//

export { ModerationPage_Context };
export default async function Moderation_Page({
  active_id,
}: {
  active_id: number | undefined;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  if (!active_id) return <></>;

  const moderation = await moncomptepro_pg.query.moderations.findFirst({
    where: eq(schema.moderations.id, active_id),
    with: {
      organizations: true,
      users: true,
    },
  });

  if (!moderation) return <p>La modération {active_id} n'existe pas</p>;

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

  const domain = moderation.users.email.split("@")[1];

  return (
    <ModerationPage_Context.Provider
      value={{ moderation, domain, users_organizations }}
    >
      <main
        class="fr-container my-12"
        hx-disinherit="*"
        hx-get={
          urls.moderations[":id"].$url({
            param: { id: moderation.id.toString() },
          }).pathname
        }
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

        <div class="grid grid-cols-2">
          <About_User />
          <About_Organisation />
        </div>

        {/* <Organization_Members_Table id={moderation.}/> */}
        <_02 />

        <hr />

        <_03 />
      </main>
    </ModerationPage_Context.Provider>
  );
}
