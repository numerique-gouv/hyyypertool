//

import { NotFoundError } from "@~/app.core/error";
import { Htmx_Events } from "@~/app.core/htmx";
import type { MonComptePro_Pg_Context } from "@~/app.middleware/moncomptepro_pg";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { OpenInZammad } from "@~/app.ui/zammad/components/OpenInZammad";
import { SearchInZammad } from "@~/app.ui/zammad/components/SearchInZammad";
import { hx_urls, urls } from "@~/app.urls";
import {
  get_duplicate_moderations,
  type get_duplicate_moderations_dto,
} from "@~/moderations.repository/get_duplicate_moderations";
import { schema } from "@~/moncomptepro.database";
import {
  get_user_by_id,
  type get_user_by_id_dto,
} from "@~/users.repository/get_user_by_id";
import { get_zammad_mail } from "@~/zammad.lib";
import { to } from "await-to-js";
import { and, asc, eq, ilike, not, or } from "drizzle-orm";
import { raw } from "hono/html";
import { createContext, useContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function Duplicate_Warning({
  moderation_id,
  organization_id,
  user_id,
}: {
  moderation_id: number;
  organization_id: number;
  user_id: number;
}) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();
  const moderations = await get_duplicate_moderations(moncomptepro_pg, {
    organization_id,
    user_id,
  });

  const user = await get_user_by_id(moncomptepro_pg, { id: user_id });
  if (!user) return <p>Utilisateur introuvable</p>;

  return (
    <Duplicate_Warning.Context.Provider
      value={{
        moderation_id,
        moderations,
        user,
      }}
    >
      <Alert_Duplicate_Moderation />
      <Alert_Duplicate_User />
    </Duplicate_Warning.Context.Provider>
  );
}

Duplicate_Warning.Context = createContext({
  moderation_id: NaN,
  moderations: {} as get_duplicate_moderations_dto,
  user: {} as NonNullable<Awaited<get_user_by_id_dto>>,
});

//

async function Alert_Duplicate_User() {
  const { moderation_id } = useContext(Duplicate_Warning.Context);
  const duplicate_users = await get_duplicate_users(moderation_id);

  const duplicate_users_count = duplicate_users.length;

  if (duplicate_users_count === 0) return raw``;

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">
        Attention : {duplicate_users_count > 1 ? duplicate_users_count : "un"}{" "}
        utilisateur
        {duplicate_users_count > 1 ? "s" : ""}{" "}
        {duplicate_users_count > 1 ? "ont" : "a"} ce nom de famille au sein de
        cette organisation.
      </h3>

      <ul>
        {duplicate_users.map(({ user_id, email, family_name, given_name }) => (
          <li key={user_id}>
            <a
              href={
                urls.users[":id"].$url({ param: { id: user_id.toString() } })
                  .pathname
              }
            >
              {given_name} {family_name} {`<${email}>`}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
async function Alert_Duplicate_Moderation() {
  const { moderations, user } = useContext(Duplicate_Warning.Context);
  const moderation_count = moderations.length;

  if (moderation_count <= 1) return raw``;

  const moderation_tickets = await get_moderation_tickets(moderations);

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s'agit de la {moderation_count}e demande pour cette organisation</p>
      <SearchInZammad search={user.email}>
        Trouver les echanges pour l'email « {user.email} » dans Zammad
      </SearchInZammad>
      <ul>
        {moderation_tickets.map(({ moderation, zammad_ticket }) => (
          <li key={moderation.id.toString()}>
            <a
              href={
                urls.moderations[":id"].$url({
                  param: { id: moderation.id.toString() },
                }).pathname
              }
            >
              Moderation#{moderation.id}
            </a>{" "}
            {moderation.moderated_at ? "✔️" : "❌"}:{" "}
            {moderation.ticket_id && zammad_ticket ? (
              <OpenInZammad ticket_id={Number(moderation.ticket_id)}>
                Ouvrir Ticket#{moderation.ticket_id} dans Zammad
              </OpenInZammad>
            ) : (
              "Pas de ticket"
            )}
          </li>
        ))}
      </ul>

      <MarkModerationAsProcessed />
    </div>
  );
}

async function MarkModerationAsProcessed() {
  const { moderation_id } = useContext(Duplicate_Warning.Context);
  const { base, element } = fieldset();
  const moderation = await get_moderation(moderation_id);

  if (moderation.moderated_at) return raw``;

  return (
    <form
      _={`
      on submit
        wait for ${Htmx_Events.enum.afterOnLoad}
        wait 2s
        go back
      `}
      {...await hx_urls.moderations[":id"].$procedures.processed.$patch({
        param: { id: moderation_id.toString() },
      })}
      hx-swap="none"
    >
      <fieldset class={base()}>
        <div class={element({ class: "text-right" })}>
          <button class={button({ intent: "danger" })} type="submit">
            Marquer la modération comme traité
          </button>
        </div>
      </fieldset>
    </form>
  );
}

//

function get_moderation_tickets(moderations: get_duplicate_moderations_dto) {
  return Promise.all(
    moderations.map(async (moderation) => {
      if (!moderation.ticket_id) return { moderation };
      const ticket_id = Number(moderation.ticket_id);
      const [, zammad_ticket] = await to(get_zammad_mail({ ticket_id }));
      return { moderation, zammad_ticket };
    }),
  );
}

//

async function get_moderation(moderation_id: number) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const moderation = await moncomptepro_pg.query.moderations.findFirst({
    columns: { moderated_at: true },
    where: eq(schema.moderations.id, moderation_id),
  });
  if (!moderation) throw new NotFoundError("Moderation not found.");
  return moderation;
}

async function get_duplicate_users(moderation_id: number) {
  const {
    var: { moncomptepro_pg },
  } = useRequestContext<MonComptePro_Pg_Context>();

  const moderation = await moncomptepro_pg.query.moderations.findFirst({
    columns: { organization_id: true },
    with: {
      user: { columns: { id: true, given_name: true, family_name: true } },
    },
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  const {
    organization_id,
    user: { family_name, id: user_id },
  } = moderation;

  return await moncomptepro_pg
    .select({
      email: schema.users.email,
      family_name: schema.users.family_name,
      given_name: schema.users.given_name,
      user_id: schema.users_organizations.user_id,
    })
    .from(schema.users_organizations)
    .leftJoin(
      schema.users,
      eq(schema.users_organizations.user_id, schema.users.id),
    )
    .where(
      and(
        or(ilike(schema.users.family_name, family_name ?? "")),
        not(eq(schema.users.id, user_id)),
        eq(schema.users_organizations.organization_id, organization_id),
      ),
    )
    .orderBy(asc(schema.users.created_at));
}
