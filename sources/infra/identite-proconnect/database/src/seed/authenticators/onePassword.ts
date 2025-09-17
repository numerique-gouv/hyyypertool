import { schema, type IdentiteProconnect_PgDatabase } from "../../index";

export function insert_1Password_authenticator(
  db: IdentiteProconnect_PgDatabase,
  user_id: number,
) {
  return db.insert(schema.authenticators).values({
    created_at: new Date("2023-06-23 3:33:33").toISOString(),
    display_name: "1Password",
    last_used_at: new Date("2023-06-24 4:44:44").toISOString(),
    usage_count: 5,
    credential_id: "1",
    credential_public_key: Buffer.from("mock-credential-key-data", "utf8"),
    counter: 0,
    credential_backed_up: false,
    user_id,
  });
}
