//

import { mock } from "bun:test";
import type { CrispApi } from "./api";

export const crisp: CrispApi = {
  create_conversation: mock().mockResolvedValue({
    session_id: "🗨️",
  }),
  get_user: mock().mockResolvedValue({
    nickname: "👩‍🚀",
  }),
  mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  send_message: mock().mockResolvedValue(undefined),
};
