//

import type { UserInfoResponse } from "openid-client";

//

export interface AgentConnect_UserInfo extends UserInfoResponse {
  sub: string;
  given_name: string;
  usual_name: string;
  email: string;
  siret: string;
  phone_number: string;
}
