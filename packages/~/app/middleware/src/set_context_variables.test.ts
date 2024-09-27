//

import { expect, test } from "bun:test";
import { Hono, type Env } from "hono";
import { contextStorage, getContext } from "hono/context-storage";
import { set_context_variables } from "./set_context_variables";

//

test("set direct variables", async () => {
  interface CloudEnv extends Env {
    Variables: {
      cloud: string;
    };
  }
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

test("set variables using parent context", async () => {
  interface RootEnv extends Env {
    Variables: {
      sun: string;
    };
  }
  interface CloudEnv extends Env {
    Variables: {
      cloud: string;
    };
  }
  const app = new Hono<RootEnv>().get(
    "/",
    contextStorage(),
    set_context_variables(() => {
      const {
        var: { sun },
      } = getContext<RootEnv>();
      return { sun: sun ?? "🌞" };
    }),
    set_context_variables<CloudEnv>(({ var: {} }) => {
      const {
        req,
        var: { sun },
      } = getContext<RootEnv>();

      return { cloud: req.query("search") === "sun" ? sun : "☁️" };
    }),
    async ({ json, var: { cloud } }) => {
      return json({ cloud });
    },
  );
  {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ cloud: "☁️" });
  }
  {
    const res = await app.request("/?search=sun");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ cloud: "🌞" });
  }
});
