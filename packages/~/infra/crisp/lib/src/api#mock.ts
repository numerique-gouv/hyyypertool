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
  send_message: mock().mockResolvedValue(undefined),
};
