import { schema, type IdentiteProconnect_PgDatabase } from "../../index";

export function insert_nordPass_authenticator(
  db: IdentiteProconnect_PgDatabase,
  user_id: number,
) {
  return db.insert(schema.authenticators).values({
    created_at: new Date("2023-06-23 13:33:33").toISOString(),
    display_name: "NordPass",
    last_used_at: new Date("2023-06-24 14:44:44").toISOString(),
    usage_count: 87,
    credential_id: "2",
    credential_public_key: Buffer.from("mock-credential-key-data", "utf8"),
    counter: 0,
    credential_backed_up: false,
    user_id,
  });
}
