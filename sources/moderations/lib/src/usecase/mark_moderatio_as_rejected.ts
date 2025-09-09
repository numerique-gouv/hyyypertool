//

import { z_username } from "@~/app.core/schema/z_username";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import {
  UpdateModerationById,
  type GetModerationDto,
} from "@~/moderations.repository";
import { append_comment } from "../comment_message";

//

export async function mark_moderatio_as_rejected({
  pg,
  moderation,
  userinfo,
  reason,
}: {
  moderation: GetModerationDto;
  userinfo: AgentConnect_UserInfo;
  pg: IdentiteProconnect_PgDatabase;
  reason: string;
}) {
  const { comment, id: moderation_id } = moderation;
  const moderated_by = z_username.parse(userinfo);

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation_id, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      reason,
      type: "REJECTED",
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
  });
}
