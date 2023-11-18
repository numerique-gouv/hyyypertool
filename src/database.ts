//

import env from ":env";
import { PrismaClient } from "@prisma/client";

//

export const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
  log: ["query", "info", "warn", "error"],
});
