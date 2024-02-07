//

import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "node:process";
import pg from "pg";
import * as schema from "../src/database/moncomptepro/drizzle/schema.js";
import { delete_database } from "../src/database/moncomptepro/seed/delete.js";
import { insert_database } from "../src/database/moncomptepro/seed/insert.js";

//

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "**/*.feature",
    setupNodeEvents,
    supportFile: false,
  },
  video: true,
});

//

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  on("task", {
    seed,
  });

  return config;
}

//

async function seed() {
  const client = new pg.Client({
    connectionString:
      env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/postgres",
  });
  await client.connect();

  const db = drizzle(client, { schema });

  await delete_database(db);
  await insert_database(db);

  await client.end();

  return null;
}
