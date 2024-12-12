//

import { NotFoundError } from "@~/app.core/error";
import type { MonCompteProDatabaseCradle } from "@~/moncomptepro.database";

//

export function FindByEmail({ pg }: MonCompteProDatabaseCradle) {
  return async function find_by_email(email: string) {
    const user = await pg.query.users.findFirst({
      columns: { id: true },
      where: (table, { eq }) => eq(table.email, email),
    });

    if (!user) throw new NotFoundError(`User ${email} not found.`);
    return user;
  };
}

export type FindByEmailHandler = ReturnType<typeof FindByEmail>;
export type FindByEmailOutput = Awaited<ReturnType<FindByEmailHandler>>;
