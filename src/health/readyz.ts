//

import { prisma } from ":database";
import { to } from "await-to-js";
import Elysia from "elysia";

export default async (app: Elysia) =>
  app.group("/readyz", (app) =>
    app
      .get("/", () => `readyz check passed`)
      .get("/prisma", async () => {
        const [, is_ok] = await to(prisma.$queryRaw`SELECT 1`);
        return "[+]prisma connection " + (is_ok ? "OK" : "FAIL");
      }),
  );
