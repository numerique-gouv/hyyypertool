//

import { zValidator } from "@hono/zod-validator";
import { HTTPError } from "@~/app.core/error";
import type { Htmx_Header } from "@~/app.core/htmx";
import { Entity_Schema } from "@~/app.core/schema";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { App_Context } from "@~/app.middleware/context";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { validate_form_schema } from "@~/moderations.lib/schema/validate.form";
import { mark_moderation_as } from "@~/moderations.lib/usecase/mark_moderation_as";
import { MemberJoinOrganization } from "@~/moderations.lib/usecase/member_join_organization";
import { GetModerationById } from "@~/moderations.repository";
import { schema } from "@~/moncomptepro.database";
import {
  join_organization,
  send_moderation_processed_email,
} from "@~/moncomptepro.lib/index";
import { forceJoinOrganization } from "@~/moncomptepro.lib/sdk";
import { add_verified_domain } from "@~/organizations.lib/usecase/add_verified_domain";
import { GetOrganizationById } from "@~/organizations.repository";
import { GetMember } from "@~/users.repository";
import { to } from "await-to-js";
import consola from "consola";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { P, match } from "ts-pattern";

//

export default new Hono<App_Context>().patch(
  "/",
  zValidator("param", Entity_Schema),
  zValidator("form", validate_form_schema),
  async function PATCH({
    text,
    req,
    notFound,
    var: { moncomptepro_pg, userinfo, sentry },
  }) {
    const { id } = req.valid("param");
    const { add_domain, add_member, send_notitfication } = req.valid("form");

    const moderation = await moncomptepro_pg.query.moderations.findFirst({
      columns: {
        comment: true,
        id: true,
        organization_id: true,
        user_id: true,
      },
      with: { user: { columns: { email: true } } },
      where: eq(schema.moderations.id, id),
    });

    if (!moderation) return notFound();

    const {
      organization_id,
      user_id,
      user: { email },
    } = moderation;
    const domain = z_email_domain.parse(email, {
      path: ["moderation.user.email"],
    });

    if (add_domain) {
      const [error] = await to(
        add_verified_domain(
          {
            get_organization_by_id: GetOrganizationById({
              pg: moncomptepro_pg,
            }),
          },
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
        .with(P.instanceOf(Error), () => {
          consola.error(error);
          throw error;
        });
    }

    const is_external = match(add_member)
      .with("AS_INTERNAL", () => false)
      .with("AS_EXTERNAL", () => true)
      .exhaustive();
    const member_join_organization = MemberJoinOrganization({
      force_join_organization: forceJoinOrganization,
      get_member: GetMember({
        pg: moncomptepro_pg,
        columns: { updated_at: true },
      }),
      get_moderation_by_id: GetModerationById({ pg: moncomptepro_pg }),
      join_organization: join_organization,
    });
    const [error] = await to(
      member_join_organization({ is_external, moderation_id: id }),
    );

    match(error)
      .with(P.instanceOf(HTTPError), () => {
        consola.error(error);
        sentry.captureException(error, {
          data: { domain, organization_id: id },
        });
      })
      .with(P.instanceOf(Error), () => {
        consola.error(error);
        throw error;
      });

    if (send_notitfication) {
      await send_moderation_processed_email({ organization_id, user_id });
    }

    await mark_moderation_as(
      {
        pg: moncomptepro_pg,
        moderation,
        userinfo,
      },
      "VALIDATED",
    );

    return text("OK", 200, {
      "HX-Trigger": [MODERATION_EVENTS.Enum.MODERATION_UPDATED].join(", "),
    } as Htmx_Header);
  },
);
