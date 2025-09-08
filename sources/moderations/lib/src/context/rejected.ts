//

import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import type { Config } from "@~/crisp.lib/types";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import type { get_moderation_dto } from "@~/moderations.repository/get_moderation";
import type { RejectedMessage } from "../schema/rejected.form";

//

export type RejectedModeration_Context = {
  crisp_config: Config;
  moderation: get_moderation_dto;
  pg: IdentiteProconnect_PgDatabase;
  reason: string;
  resolve_delay: number;
  subject: string;
  userinfo: AgentConnect_UserInfo;
};
export type RejectedFullMessage = RejectedMessage & { to: string };
