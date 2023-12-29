//

import {
  moncomptepro_pg,
  schema,
  type Moderation,
  type Organization,
  type User,
} from ":database:moncomptepro";
import { eq } from "drizzle-orm";
import { createContext } from "hono/jsx";
import { _02 } from "./02";
import { _03 } from "./03";
import { _04 } from "./04";

//

export const ModerationPage_Context = createContext({
  moderation: {} as Moderation & { users: User; organizations: Organization },
  domain: "",
});

export async function ModerationPage({
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

  const domain = moderation.users.email.split("@")[1];

  return (
    <ModerationPage_Context.Provider value={{ moderation, domain }}>
      <_02 />
      <hr />
      <_03 moderation_id={active_id} />
      <hr />
      <_04 moderation_id={active_id} />
    </ModerationPage_Context.Provider>
  );
}
