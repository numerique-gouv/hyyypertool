//

import { prisma } from ":database";
import { moncomptepro_pg } from ":database:moncomptepro";
import { to } from "await-to-js";
import { sql } from "drizzle-orm";
import { Hono } from "hono";

//

export const readyz = new Hono();
readyz.get("/", ({ text }) => text(`readyz check passed`));
readyz.get("/prisma", async ({ text }) => {
  const [, is_ok] = await to(prisma.$queryRaw`SELECT 1`);
  return text("[+]prisma connection " + (is_ok ? "OK" : "FAIL"));
});
readyz.get("/drizzle/moncomptepro", async ({ text }) => {
  const [, is_ok] = await to(moncomptepro_pg.execute(sql`SELECT 1`));
  return text("[+]drizzle moncomptepro connection " + (is_ok ? "OK" : "FAIL"));
});
