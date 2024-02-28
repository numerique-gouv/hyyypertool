//

import type { get_user_by_id_dto } from "@~/users.repository/get_user_by_id";
import { createContext } from "hono/jsx";

//

export default createContext({
  user: {} as NonNullable<Awaited<get_user_by_id_dto>>,
});
