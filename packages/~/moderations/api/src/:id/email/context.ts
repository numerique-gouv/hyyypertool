//

import { NotFoundError } from "@~/app.core/error";
import { schema, type MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { type get_zammad_mail_dto } from "@~/zammad.lib";
import { eq } from "drizzle-orm";
import { createContext } from "hono/jsx";

//

export const Moderation_Context = createContext({
  moderation: {} as get_moderation_dto,
});

export const List_Context = createContext({
  articles: [] as get_zammad_mail_dto,
  show_more: false,
  subject: "",
  ticket_id: NaN,
});

export async function get_moderation(
  pg: MonComptePro_PgDatabase,
  { moderation_id }: { moderation_id: number },
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: { ticket_id: true },
    where: eq(schema.moderations.id, moderation_id),
    with: { user: { columns: { email: true } } },
  });

  if (!moderation) {
    throw new NotFoundError("Moderation not found");
  }

  return moderation;
}

export type get_moderation_dto = Awaited<ReturnType<typeof get_moderation>>;
