//

import { prisma } from ":database";
import { to } from "await-to-js";
import { Hono } from "hono";

//

export const readyz = new Hono()
  .get("/", ({ text }) => text(`readyz check passed`))
  .get("/prisma", async ({ text }) => {
    const [, is_ok] = await to(prisma.$queryRaw`SELECT 1`);
    return text("[+]prisma connection " + (is_ok ? "OK" : "FAIL"));
  });
