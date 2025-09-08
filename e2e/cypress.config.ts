//

import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "node:process";
import pg from "pg";
import * as schema from "../sources/infra/identite-proconnect/database/src/drizzle/schema.js";
import { delete_database } from "../sources/infra/identite-proconnect/database/src/seed/delete.js";
import { insert_database } from "../sources/infra/identite-proconnect/database/src/seed/insert.js";

//

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    reporter: require.resolve(
      "@badeball/cypress-cucumber-preprocessor/pretty-reporter",
    ),
    setupNodeEvents,
    specPattern: "**/*.feature",
    supportFile: false,
  },
  env: {
    APP_MONCOMPTEPRO_URL: "http://localhost:6300",
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
