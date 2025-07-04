//

import { $ } from "bun";

//

$.env({
  ...process.env,
  // LOCK(douglasduteil): this is a lock to prevent production database seeding
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/postgres",
});

//

await $`docker compose up --wait postgres-identite-proconnect`;
await $`bun run database:identite-proconnect:migrator`;
await $`bun run database:identite-proconnect:seed`;
