//

import type { Integration } from "@sentry/types";
import { expect, mock, test } from "bun:test";
import { Hono } from "hono";

//

mock.module("@~/app.core/config", () => {
  // TODO(douglasduteil): use the context var config
  return { default: {} };
});
mock.module("@sentry/profiling-node", () => {
  // NOTE(douglasduteil): mocking @sentry/profiling-node
  // @sentry/profiling-node is not compatible with Bun
  return {
    nodeProfilingIntegration: mock(
      (): Integration => ({
        name: "nodeProfilingIntegration",
      }),
    ),
  };
});
const { set_sentry } = await import("./index");

//

const app = new Hono()
  .use(set_sentry())
  .get("/", ({ text }) => text("✅ GET"))
  .options("/", ({ text }) => text("✅ OPTIONS"));

test("should respond fo GET method", async () => {
  const response = await app.request("/");
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("✅ GET");
});

test("should respond for HEAD method", async () => {
  const response = await app.request("/", { method: "HEAD" });
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("");
});

test("should respond for OPTIONS method", async () => {
  const response = await app.request("/", { method: "OPTIONS" });
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("✅ OPTIONS");
});
