import { schema, type IdentiteProconnect_PgDatabase } from "../../index";

export function insert_1Password_authenticator(
  db: IdentiteProconnect_PgDatabase,
  user_id: number,
) {
  return db.insert(schema.authenticators).values({
    created_at: new Date("2024-06-10T10:00:00.000Z").toISOString(),
    display_name: "1Password",
    last_used_at: new Date("2024-06-15T12:00:00.000Z").toISOString(),
    usage_count: 5,
    credential_id: "",
    // adds the type any because Drizzle & @electric-sql/pglite don't support Buffer
    credential_public_key: Buffer.from(
      "mock-credential-key-data",
      "utf8",
    ) as any,
    counter: 0,
    credential_backed_up: false,
    user_id,
  });
}
