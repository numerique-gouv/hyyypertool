//

import type { AgentConnect_UserInfo } from "@~/app.middleware/session";
import type { CrispApi } from "@~/crisp.lib/api";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import type { GetModerationDto } from "@~/moderations.repository";
import type { RejectedMessage } from "../schema/rejected.form";

//

export type RejectedModeration_Context = {
  crisp: CrispApi;
  moderation: GetModerationDto;
  pg: IdentiteProconnect_PgDatabase;
  reason: string;
  resolve_delay: number;
  subject: string;
  userinfo: AgentConnect_UserInfo;
};
export type RejectedFullMessage = RejectedMessage & { to: string };
