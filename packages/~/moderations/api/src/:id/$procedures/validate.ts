//

import { zValidator } from "@hono/zod-validator";
import { HTTPError } from "@~/app.core/error";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { z_coerce_boolean } from "@~/app.core/schema/z_coerce_boolean";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import type { UserInfo_Context } from "@~/app.middleware/vip_list.guard";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { schema } from "@~/moncomptepro.database";
import { send_moderation_processed_email } from "@~/moncomptepro.lib/index";
import { add_verified_domain } from "@~/organizations.lib/usecase/add_verified_domain";
import { to } from "await-to-js";
import consola from "consola";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { P, match } from "ts-pattern";
import { z } from "zod";

//

export default new Hono<MonComptePro_Pg_Context & UserInfo_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  zValidator(
    "form",
    z.object({
      add_domain: z.string().default("false").pipe(z_coerce_boolean),
    }),
  ),
  async ({
    text,
    req,
    notFound,
    var: { moncomptepro_pg, userinfo, sentry },
  }) => {
    const { id } = req.valid("param");
    const { add_domain } = req.valid("form");

    const moderation = await moncomptepro_pg.query.moderations.findFirst({
      columns: { organization_id: true, user_id: true },
      with: { users: { columns: { email: true } } },
      where: eq(schema.moderations.id, id),
    });

    if (!moderation) return notFound();

    const {
      organization_id,
      user_id,
      users: { email },
    } = moderation;
    const domain = z_email_domain.parse(email, { path: ["data.email"] });

    if (add_domain) {
      const [error] = await to(
        add_verified_domain(
          { pg: moncomptepro_pg },
          { organization_id, domain },
        ),
      );

      match(error)
        .with(P.instanceOf(HTTPError), () => {
          consola.error(error);
          sentry.captureException(error, {
            data: { domain, organization_id: id },
          });
        })
        .otherwise(() => {
          throw error;
        });
    }

    await send_moderation_processed_email({ organization_id, user_id });
    await moncomptepro_pg
      .update(schema.moderations)
      .set({
        // comment: "Validaté ap " + userinfo.email,
        moderated_at: new Date(),
        moderated_by: userinfo.email,
      })
      .where(eq(schema.moderations.id, id));

    return text("OK", 200, {
      "HX-Trigger": [
        MODERATION_EVENTS.Enum.MODERATION_EMAIL_UPDATED,
        MODERATION_EVENTS.Enum.MODERATION_UPDATED,
      ].join(", "),
    } as Htmx_Header);
  },
);
