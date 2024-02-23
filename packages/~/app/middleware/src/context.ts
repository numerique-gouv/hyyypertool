//

import type { Csp_Context } from "./csp_headers";
import type { MonComptePro_Pg_Context } from "./moncomptepro_pg";
import type { UserInfo_Context } from "./vip_list.guard";

export type App_Context = Csp_Context &
  UserInfo_Context &
  MonComptePro_Pg_Context;
