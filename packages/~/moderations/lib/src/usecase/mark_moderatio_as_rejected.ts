//

import { z_username } from "@~/app.core/schema/z_username";
import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import type { get_moderation_dto } from "@~/moderations.repository/get_moderation";
import { update_moderation_by_id } from "@~/moderations.repository/update_moderation_by_id";
import type { MonComptePro_PgDatabase } from "@~/moncomptepro.database";
import { append_comment } from "../comment_message";

//

export async function mark_moderatio_as_rejected({
  pg,
  moderation,
  userinfo,
}: {
  moderation: get_moderation_dto;
  userinfo: AgentConnect_UserInfo;
  pg: MonComptePro_PgDatabase;
}) {
  const { comment, id: moderation_id } = moderation;
  const moderated_by = z_username.parse(userinfo);

  await update_moderation_by_id(pg, {
    comment: append_comment(comment, {
      created_by: userinfo.email,
      type: "REJECTED",
    }),
    moderation_id,
    moderated_by,
    moderated_at: new Date().toISOString(),
  });
}
