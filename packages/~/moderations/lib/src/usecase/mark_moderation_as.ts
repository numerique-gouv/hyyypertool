//

import { z_username } from "@~/app.core/schema/z_username";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import type {
  IdentiteProconnect_PgDatabase,
  schema,
} from "@~/identite-proconnect.database";
import { UpdateModerationById } from "@~/moderations.repository";
import { append_comment, type Comment_Type } from "../comment_message";

//

export async function mark_moderation_as(
  {
    moderation,
    pg,
    reason,
    userinfo,
  }: {
    moderation: Pick<typeof schema.moderations.$inferSelect, "comment" | "id">;
    pg: IdentiteProconnect_PgDatabase;
    reason: string;
    userinfo: AgentConnect_UserInfo;
  },
  type: Comment_Type["type"],
) {
  const { comment, id: moderation_id } = moderation;
  const username = z_username.parse(userinfo);
  const moderated_by = `${username} <${userinfo.email}>`;

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation_id, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason,
      type,
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
  });
}
