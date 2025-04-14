//

import { z_username } from "@~/app.core/schema/z_username";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import { UpdateModerationById } from "@~/moderations.repository";
import type { get_moderation_dto } from "@~/moderations.repository/get_moderation";
import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { append_comment } from "../comment_message";

//

export async function mark_moderatio_as_rejected({
  pg,
  moderation,
  userinfo,
  subject,
}: {
  moderation: get_moderation_dto;
  userinfo: AgentConnect_UserInfo;
  pg: MonComptePro_PgDatabase;
  subject: string;
}) {
  const { comment, id: moderation_id } = moderation;
  const moderated_by = z_username.parse(userinfo);

  const update_moderation_by_id = UpdateModerationById({ pg });
  await update_moderation_by_id(moderation_id, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      subject,
      type: "REJECTED",
    }),
    moderated_by,
    moderated_at: new Date().toISOString(),
  });
}
