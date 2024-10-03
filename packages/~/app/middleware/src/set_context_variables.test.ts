//

import { expect, test } from "bun:test";
import { Hono, type Env } from "hono";
import { contextStorage, getContext } from "hono/context-storage";
import { set_context_variables } from "./set_context_variables";

//

test("set direct variables", async () => {
  const app = new Hono().get(
    "/",
    set_context_variables<CloudEnv>(() => ({ cloud: "☁️" })),
    async ({ json, var: { cloud } }) => {
      return json({ cloud });
    },
  );

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ cloud: "☁️" });
});

test("set multiple direct variables", async () => {
  const app = new Hono().get(
    "/",
    set_context_variables<CloudEnv>(() => ({ cloud: "☁️" })),
    set_context_variables<SunEnv>(() => ({ sun: "🌞" })),
    async ({ json, var: { cloud, sun } }) => {
      return json({ cloud, sun });
    },
  );

  const res = await app.request("/");
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ cloud: "☁️", sun: "🌞" });
});

test("set variables using parent context", async () => {
  const app = new Hono<SunEnv>().get(
    "/",
    contextStorage(),
    set_context_variables<SunEnv>(() => {
      const {
        var: { sun },
      } = getContext<SunEnv>();
      return { sun: sun ?? "🌞" };
    }),
    set_context_variables<CloudEnv>(() => {
      const {
        req,
        var: { sun },
      } = getContext<SunEnv>();
      const cloud = req.query("search") === "sun" ? sun : "☁️";
      return { cloud };
    }),
    async ({ json, var: { cloud, sun } }) => {
      return json({ cloud, sun });
    },
  );
  {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ cloud: "☁️", sun: "🌞" });
  }
  {
    const res = await app.request("/?search=sun");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ cloud: "🌞", sun: "🌞" });
  }
});

//

interface CloudEnv extends Env {
  Variables: {
    cloud: string;
  };
}

interface SunEnv extends Env {
  Variables: {
    sun: string;
  };
}
