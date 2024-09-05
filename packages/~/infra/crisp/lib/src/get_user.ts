//

import { type Config, fetch_crisp, type User } from "@numerique-gouv/crisp";
import type { OperatorsRouter } from "@numerique-gouv/crisp/router/operators";

//

export function get_user_shell(config: Config) {
  return async function get_user_by_email(email: string) {
    const operators = await fetch_crisp<OperatorsRouter>(config, {
      endpoint: `/v1/website/${config.website_id}/operators/list`,
      method: "GET",
      searchParams: {},
    });

    const operator = operators.find(({ details }) => details.email === email);

    if (!operator) throw new Error(`Operator "${email}" not found.`);

    return {
      user_id: operator.details.user_id,
      nickname: `${operator.details.first_name} ${operator.details.last_name}`,
    } as User;
  };
}

export type get_user_by_email_fn = ReturnType<typeof get_user_shell>;
