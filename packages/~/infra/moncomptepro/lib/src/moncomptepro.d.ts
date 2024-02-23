//

/// <reference types="moncomptepro/src/types/moderation.d.ts" />
/// <reference types="moncomptepro/src/types/user.d.ts" />
/// <reference types="moncomptepro/src/types/user-organization-link.d.ts" />

export type MCP_Moderation = Moderation | LegacyModeration;
export type MCP_User = User;
export type MCP_UserOrganizationLink = UserOrganizationLink;

//

interface LegacyModeration {
  type: "ask_for_sponsorship" | "big_organization_join";
}
