//

import env from "@~/app.core/config";
import { HTTPError } from "@~/app.core/error";
import consola from "consola";
import { join } from "node:path";

//

type Options =
  | {
      endpoint: "/api/admin/join-organization";
      method: "POST";
      searchParams: {
        is_external: "true" | "false";
        organization_id: string;
        user_id: string;
      };
    }
  | {
      endpoint: "/api/admin/send-moderation-processed-email";
      method: "POST";
      searchParams: { organization_id: string; user_id: string };
    };

export async function fetch_mcp_admin_api(options: Options) {
  const searchParams = new URLSearchParams(options.searchParams);
  const url = `${join(env.API_AUTH_URL, options.endpoint)}?${searchParams}`;
  const headers = new Headers({
    Authorization: `Basic ${Buffer.from(`${env.API_AUTH_USERNAME}:${env.API_AUTH_PASSWORD}`).toString("base64")}`,
  });

  consola.info(`  <<-- ${options.method} ${url}`);

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
  });

  consola.info(
    `  -->> ${options.method} ${url} ${response.status} ${response.statusText}`,
  );

  if (!response.ok) {
    throw new HTTPError(
      `${options.method} ${url} ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as any;
}
