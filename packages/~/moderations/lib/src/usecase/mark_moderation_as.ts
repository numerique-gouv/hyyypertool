//

import { userinfo_to_username } from "@~/app.layout";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import { update_moderation_by_id } from "@~/moderations.repository/update_moderation_by_id";
import type { MonComptePro_PgDatabase, schema } from "@~/moncomptepro.database";
import { append_comment, type Comment_Type } from "../comment_message";

//

export async function mark_moderation_as(
  {
    pg,
    moderation,
    userinfo,
  }: {
    moderation: Pick<typeof schema.moderations.$inferSelect, "comment" | "id">;
    userinfo: AgentConnect_UserInfo;
    pg: MonComptePro_PgDatabase;
  },
  type: Comment_Type["type"],
) {
  const { comment, id: moderation_id } = moderation;
  const username = userinfo_to_username(userinfo);
  const moderated_by = `${username} <${userinfo.email}>`;

  await update_moderation_by_id(pg, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      type,
    }),
    moderation_id,
    moderated_by,
    moderated_at: new Date().toISOString(),
  });
}