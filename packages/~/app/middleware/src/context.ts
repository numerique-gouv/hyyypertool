//

import type { AppVariables_Context } from "@~/app.core/config";
import type { SentryVariables_Context } from "@~/app.sentry";
import type { Csp_Context } from "./csp_headers";
import type { MonComptePro_Pg_Context } from "./moncomptepro_pg";
import type { Session_Context } from "./session";
import type { NonceVariables_Context } from "./set_nonce";
import type { UserInfoVariables_Context } from "./set_userinfo";

export type App_Context = AppVariables_Context &
  Csp_Context &
  MonComptePro_Pg_Context &
  NonceVariables_Context &
  Session_Context &
  UserInfoVariables_Context &
  // CradleVariablesType<object> &
  SentryVariables_Context;
