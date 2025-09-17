import { schema, type IdentiteProconnect_PgDatabase } from "../../index";

export function insert_nordPass_authenticator(
  db: IdentiteProconnect_PgDatabase,
  user_id: number,
) {
  return db.insert(schema.authenticators).values({
    created_at: new Date("2024-06-10T10:00:00.000Z").toISOString(),
    display_name: "NordPass",
    last_used_at: new Date("2024-06-15T12:00:00.000Z").toISOString(),
    usage_count: 87,
    credential_id: "2",
    credential_public_key: Buffer.from("mock-credential-key-data", "utf8"),
    counter: 0,
    credential_backed_up: false,
    user_id,
  });
}
