//

/// <reference types="@numerique-gouv/moncomptepro/src/types/moderation.d.ts" />
/// <reference types="@numerique-gouv/moncomptepro/src/types/email-domain.d.ts" />
/// <reference types="@numerique-gouv/moncomptepro/src/types/user.d.ts" />
/// <reference types="@numerique-gouv/moncomptepro/src/types/user-organization-link.d.ts" />

export type MCP_Moderation = Moderation | LegacyModeration;
export type MCP_EmailDomain_Type = EmailDomain["type"];

//

interface LegacyModeration {
  type: "ask_for_sponsorship" | "big_organization_join";
}
