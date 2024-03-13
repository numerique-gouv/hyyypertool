//

import type { getSentry } from "@hono/sentry";
import type { Csp_Context } from "./csp_headers";
import type { MonComptePro_Pg_Context } from "./moncomptepro_pg";
import type { Session_Context } from "./session";
import type { UserInfo_Context } from "./vip_list.guard";

export type App_Context = Csp_Context &
  UserInfo_Context &
  MonComptePro_Pg_Context &
  Session_Context & {
    Variables: {
      sentry: ReturnType<typeof getSentry>;
    };
  };
