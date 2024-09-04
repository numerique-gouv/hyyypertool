//

import { set_config } from "@~/app.middleware/set_config";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { beforeAll, expect, setSystemTime, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { set_userinfo } from "../../middleware/src/set_userinfo";
import { Main_Layout } from "./main";

//

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

test("Main Layout", async () => {
  const app = new Hono()
    .use(set_config({}))
    .use(set_userinfo({ given_name: "Lara", usual_name: "Croft" }))
    .use(set_nonce("nonce"))
    .use(jsxRenderer(Main_Layout))
    .get("/", (c) => {
      return c.render("✅");
    });

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.text()).toMatchSnapshot();
});
