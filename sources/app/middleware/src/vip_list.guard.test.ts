//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { set_config } from "./set_config";
import { set_nonce } from "./set_nonce";
import { set_userinfo } from "./set_userinfo";
import { vip_list_guard } from "./vip_list.guard";

//

test("should let good captains pass", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    set_userinfo({ email: "good@captain.yargs" }),
    vip_list_guard({ vip_list: ["good@captain.yargs"] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  const body = await res.text();
  expect(body).toBe("✅");
});

test("should stop any anonymous user", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(302);
  expect(await res.text()).toBe("");
});

test("should redirect hx-request", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/", {
    headers: new Headers({ "hx-request": "true" }),
  });

  expect(res.status).toBe(401);
  expect(await res.text()).toBe("Unauthorized");
});

test("should stop pirates", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    set_userinfo({ email: "verybad@pirate.yargs" }),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(200);
  const body = await res.text();
  expect(body).toContain("<!DOCTYPE html>");
  expect(body).toContain("Accès Non Autorisé");
});

test("should redirect anonymous user with redirect_to parameter for non-root path", async () => {
  const app = new Hono().get(
    "/users",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/users");

  expect(res.status).toBe(302);
  const location = res.headers.get("location");
  expect(location).toBe("http://localhost/?redirect_to=%2Fusers");
});

test("should redirect anonymous user without redirect_to parameter for root path", async () => {
  const app = new Hono().get(
    "/",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/");

  expect(res.status).toBe(302);
  const location = res.headers.get("location");
  expect(location).toBe("http://localhost/");
});

test("should redirect hx-request with redirect_to parameter in HX-Location header", async () => {
  const app = new Hono().get(
    "/organizations",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/organizations", {
    headers: new Headers({ "hx-request": "true" }),
  });

  expect(res.status).toBe(401);
  expect(await res.text()).toBe("Unauthorized");
  const hxLocation = res.headers.get("HX-Location");
  expect(hxLocation).toBe("http://localhost/?redirect_to=%2Forganizations");
});

test("should preserve query parameters in redirect_to", async () => {
  const app = new Hono().get(
    "/moderations/:id",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("/moderations/42?tab=info");

  expect(res.status).toBe(302);
  const location = res.headers.get("location");
  expect(location).toBe("http://localhost/?redirect_to=%2Fmoderations%2F42%3Ftab%3Dinfo");
});

test("should not add redirect_to for invalid paths (security)", async () => {
  const app = new Hono().get(
    "//evil.com",
    jsxRenderer(),
    set_config({}),
    set_nonce("nonce"),
    vip_list_guard({ vip_list: [] }),
    async ({ text }) => {
      return text("✅");
    },
  );

  const res = await app.request("//evil.com");

  expect(res.status).toBe(302);
  const location = res.headers.get("location");
  expect(location).toBe("http://localhost/");
});
