import type { MCP_Moderation } from ":moncomptepro";
import { match } from "ts-pattern";

export function moderation_type_to_emoji(type: string) {
  return match(type as MCP_Moderation["type"])
    .with("ask_for_sponsorship", () => "🧑‍🤝‍🧑")
    .with("big_organization_join", () => "🏢")
    .with("non_verified_domain", () => "🔓")
    .with("organization_join_block", () => "🕵️")
    .otherwise(() => "⁉️");
}
