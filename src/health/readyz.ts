//

import { prisma } from ":database";
import Elysia from "elysia";

export default async (app: Elysia) =>
  app.group("/readyz", (app) =>
    app
      .get("/", () => `readyz check passed`)
      .get("/prisma", async () => {
        return (
          "[+]prisma " +
          (await prisma.$queryRaw`SELECT 1`.then(
            () => "OK",
            () => "FAIL",
          ))
        );
      }),
  );
