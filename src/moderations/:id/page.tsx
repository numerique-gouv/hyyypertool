//

import { hx_trigger_from_body } from ":common/htmx";
import {
  schema,
  type Moderation,
  type Organization,
  type User,
  type Users_Organizations,
} from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { app_hc } from ":hc";
import { MODERATION_EVENTS } from ":moderations/event";
import { button } from ":ui/button";
import { and, eq } from "drizzle-orm";
import { createContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { _02 } from "./02";
import { _03 } from "./03";
import { About_Organisation } from "./About_Organisation";
import { About_User } from "./About_User";
import { Header } from "./Header";

//

export const ModerationPage_Context = createContext({
  moderation: {} as Moderation & { users: User; organizations: Organization },
  domain: "",
  users_organizations: {} as Users_Organizations | undefined,
});

export async function Moderation_Page({
  active_id,
}: {
  active_id: number | undefined;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<moncomptepro_pg_Context>();

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
          app_hc.moderations[":id"].$url({
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

        <_02 />

        <hr />

        <_03 moderation_id={active_id} />
      </main>
    </ModerationPage_Context.Provider>
  );
}
