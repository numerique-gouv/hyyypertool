//

import {
  moncomptepro_pg,
  schema,
  type Moderation,
  type Organization,
  type User,
  type Users_Organizations,
} from ":database:moncomptepro";
import { and, eq } from "drizzle-orm";
import { createContext } from "hono/jsx";
import { _02 } from "../02";
import { _03 } from "../03";

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
      <_02 />
      <hr />
      <_03 moderation_id={active_id} />
    </ModerationPage_Context.Provider>
  );
}
