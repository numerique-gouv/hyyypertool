//

import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import env from "../src/common/env.js";
import * as schema from "../src/database/moncomptepro/drizzle/schema.js";

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
    connectionString: env.DATABASE_URL,
  });
  await client.connect();

  const db = drizzle(client, { schema });

  const moderation = await db.insert(schema.moderations).values({
    organization_id: 1,
    user_id: 1,
    type: "organization_join_block",
    ticket_id: 73930,
    comment: "This is a test",
  });

  return null;
}
