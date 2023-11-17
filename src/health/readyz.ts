//

import { prisma } from ":database";
import Elysia from "elysia";

export default async (app: Elysia) =>
  app.group("/readyz", (app) =>
    app
      .get("/", () => `readyz check passed`)
      .get("/prisma", async () => {
        const test = await prisma.$queryRaw`SELECT 1`.then(
          () => true,
          () => false,
        );
        return "[+]prisma connection" + (test ? "OK" : "FAIL");
      }),
  );
