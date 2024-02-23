//

import { fetch_mcp_admin_api } from "./fetch";

//
export async function join_organization({
  is_external,
  organization_id,
  user_id,
}: {
  is_external: boolean;
  organization_id: number;
  user_id: number;
}): Promise<{}> {
  return fetch_mcp_admin_api({
    endpoint: "/api/admin/join-organization",
    method: "POST",
    searchParams: {
      is_external: is_external ? "true" : "false",
      organization_id: String(organization_id),
      user_id: String(user_id),
    },
  });
}

export async function mark_domain_as_verified({
  domain,
  organization_id,
}: {
  domain: string;
  organization_id: number;
}): Promise<{}> {
  return fetch_mcp_admin_api({
    endpoint: "/api/admin/mark-domain-as-verified",
    method: "POST",
    searchParams: {
      domain: String(domain),
      organization_id: String(organization_id),
    },
  });
}

export async function send_moderation_processed_email({
  organization_id,
  user_id,
}: {
  organization_id: number;
  user_id: number;
}): Promise<{}> {
  return fetch_mcp_admin_api({
    endpoint: "/api/admin/send-moderation-processed-email",
    method: "POST",
    searchParams: {
      organization_id: String(organization_id),
      user_id: String(user_id),
    },
  });
}
