//

import { api_ref } from ":api_ref";
import type { UserInfo_Context } from ":auth/vip_list.guard";
import type { Csp_Context } from ":common/csp_headers";
import type { Htmx_Header } from ":common/htmx";
import { Entity_Schema } from ":common/schema";
import { hyyyyyypertool_session } from ":common/session";
import { schema, type User } from ":database:moncomptepro";
import type { moncomptepro_pg_Context } from ":database:moncomptepro/middleware";
import { app_hc } from ":hc";
import { button } from ":ui/button";
import { CopyButton } from ":ui/button/copy";
import { GoogleSearchButton } from ":ui/button/search";
import { Main_Layout, userinfo_to_username } from ":ui/layout/main";
import { LocalTime } from ":ui/time/LocalTime";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

//

export default new Hono<
  moncomptepro_pg_Context & UserInfo_Context & Csp_Context
>()
  .use("*", jsxRenderer(Main_Layout, { docType: true }))
  .use("*", hyyyyyypertool_session)
  .get(
    "/",
    zValidator("param", Entity_Schema),
    async function GET({
      req,
      render,
      notFound,
      var: { nonce, userinfo, moncomptepro_pg },
    }) {
      const { id } = req.valid("param");

      const user = await moncomptepro_pg.query.users.findFirst({
        where: eq(schema.users.id, id),
      });

      if (!user) {
        return notFound();
      }

      const username = userinfo_to_username(userinfo);
      return render(
        <main class="fr-container">
          <h1>👨‍💻 A propos de {user.given_name}</h1>
          <Fiche user={user} />
          <AccountInfo user={user} />
          <hr />
          <Actions user={user} />
          <br />
          <hr />
          <b>{user.given_name}</b> est enregistré(e) dans les organisations
          suivantes :
          <div class="fr-table max-w-full overflow-x-auto">
            <div
              hx-get={api_ref("/legacy/users/:id/organizations", {
                id: String(user.id),
              })}
              hx-target="this"
              hx-trigger="load"
              class="fr-table"
              id="table-user-organisations"
            ></div>
          </div>
          <hr />
          <b>{user.given_name}</b> est enregistré(e) dans les modérations
          suivantes :
          <div class="fr-table max-w-full overflow-x-auto">
            <div
              hx-get={
                app_hc.legacy.users[":id"].moderations.$url({
                  param: {
                    id: user.id.toString(),
                  },
                }).pathname
              }
              hx-target="this"
              hx-trigger="load"
              class="fr-table"
              id="table-user-organisations"
            ></div>
          </div>
        </main>,
        { nonce, username },
      );
    },
  )
  .delete(
    "/",
    zValidator("param", Entity_Schema),
    async function DELETE({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");
      await moncomptepro_pg.delete(schema.users).where(eq(schema.users.id, id));
      return text("OK", 200, {
        "HX-Location": api_ref("/legacy/users", {}),
      } as Htmx_Header);
    },
  )
  .patch(
    "/reset",
    zValidator("param", Entity_Schema),
    async function PATCH_RESET({ text, req, var: { moncomptepro_pg } }) {
      const { id } = req.valid("param");
      await moncomptepro_pg
        .update(schema.users)
        .set({
          email_verified: false,
        })
        .where(eq(schema.users.id, id));
      return text("OK", 200, { "HX-Refresh": "true" } as Htmx_Header);
    },
  );

//

function Actions({ user }: { user: User }) {
  const { email, id } = user;
  const domain = email.split("@")[1];
  return (
    <div class="grid grid-cols-3 justify-items-center gap-1">
      <CopyButton text={email}>Copier l'email</CopyButton>
      <CopyButton text={domain}>Copier le domain</CopyButton>
      <GoogleSearchButton query={domain}>
        « <span>{domain}</span> » sur Google
      </GoogleSearchButton>
      <button
        class={button({ intent: "danger" })}
        hx-patch={api_ref("/legacy/users/:id/reset", { id: id.toString() })}
        hx-swap="none"
      >
        🚫 réinitialiser la vérification de l’email (bloquer)
      </button>
      <button
        class={button({ intent: "dark" })}
        hx-delete={api_ref("/legacy/users/:id", { id: id.toString() })}
        hx-swap="none"
      >
        🗑️ supprimer définitivement ce compte
      </button>
    </div>
  );
}

function Fiche({ user }: { user: User }) {
  return (
    <ul>
      <li>
        id : <b>{user.id}</b>
      </li>
      <li>
        email : <b>{user.email}</b>
      </li>
      <li>
        prénom : <b>{user.given_name}</b>
      </li>
      <li>
        nom : <b>{user.family_name}</b>
      </li>
      <li>
        téléphone : <b>{user.phone_number}</b>
      </li>
      <li>
        poste : <b>{user.job}</b>
      </li>
    </ul>
  );
}

function AccountInfo({ user }: { user: User }) {
  return (
    <ul>
      <li>
        nombre de connection : <b>{user.sign_in_count}</b>
      </li>
      <li>
        Création :{" "}
        <b>
          <LocalTime date={user.created_at} />
        </b>
      </li>
      <li>
        Dernière connectio :{" "}
        <b>
          <LocalTime date={user.last_sign_in_at} />
        </b>
      </li>
      <li>
        Dernière modif :
        <b>
          <LocalTime date={user.updated_at} />
        </b>
      </li>
      <li>
        Email vérifié : <b>{user.email_verified ? "✅" : "❌"}</b>
      </li>
      <li>
        mail de vérif envoyé :{" "}
        <b>
          <LocalTime date={user.verify_email_sent_at} />
        </b>
      </li>
      <li>
        mail chgmt mdp envoyé :{" "}
        <b>
          <LocalTime date={user.reset_password_sent_at} />
        </b>
      </li>
    </ul>
  );
}
