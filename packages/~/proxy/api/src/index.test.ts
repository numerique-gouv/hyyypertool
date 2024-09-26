//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import proxy from "./index";

//

test('redirect to "/hello"', async () => {
  const response = await new Hono()
    .get("/hello", ({ text }) => text("world"))
    .route("/proxy", proxy)
    .request("/proxy/localhost:3000/hello");

  expect(response.status).toBe(302);
  expect(response.headers.get("location")).toBe("http://localhost:3000/hello");
});
