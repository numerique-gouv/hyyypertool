//

import env from ":env";
import { PrismaClient } from "@prisma/client";

//
console.log(env.DATABASE_URL);
export const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
  log: ["query", "info", "warn", "error"],
});
