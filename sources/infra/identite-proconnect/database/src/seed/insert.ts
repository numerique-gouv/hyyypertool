//

import type { MCP_Moderation } from "@~/identite-proconnect.lib/identite-proconnect.d";
import consola from "consola";
import type { IdentiteProconnect_PgDatabase } from "../index";
import { schema } from "../index";
import { insert_abracadabra } from "./organizations/abracadabra";
import { insert_aldp } from "./organizations/aldp";
import { insert_bosch_france } from "./organizations/bosch_france";
import { insert_bosch_rexroth } from "./organizations/bosch_rexroth";
import { insert_commune_de_pompierre } from "./organizations/commune_de_pompierre";
import { insert_dengi } from "./organizations/dengi";
import { insert_dinum } from "./organizations/dinum";
import { insert_sak } from "./organizations/sak";
import { insert_yes_we_hack } from "./organizations/yes_we_hack";
import { insert_jeanbon } from "./users/jeanbon";
import { insert_jeandre } from "./users/jeandre";
import { insert_mariebon } from "./users/mariebon";
import { insert_pierrebon } from "./users/pierrebon";
import { insert_raphael } from "./users/raphael";
import { insert_raphael_alpha } from "./users/raphael_alpha";
import { insert_richardbon } from "./users/richardbon";

//

export async function insert_database(db: IdentiteProconnect_PgDatabase) {
  try {
    const raphael = await insert_raphael(db);
    consola.verbose(
      `🌱 INSERT user ${raphael.given_name} ${raphael.family_name}`,
    );
    const raphael_alpha = await insert_raphael_alpha(db);
    consola.verbose(
      `🌱 INSERT user ${raphael_alpha.given_name} ${raphael_alpha.family_name}`,
    );
    const jean_bon = await insert_jeanbon(db);
    consola.verbose(
      `🌱 INSERT user ${jean_bon.given_name} ${jean_bon.family_name}`,
    );
    const jean_dre = await insert_jeandre(db);
    consola.verbose(
      `🌱 INSERT user ${jean_dre.given_name} ${jean_dre.family_name}`,
    );
    const pierre_bon = await insert_pierrebon(db);
    consola.verbose(
      `🌱 INSERT user ${pierre_bon.given_name} ${pierre_bon.family_name}`,
    );
    const richard_bon = await insert_richardbon(db);
    consola.verbose(
      `🌱 INSERT user ${richard_bon.given_name} ${richard_bon.family_name}`,
    );
    const marie_bon = await insert_mariebon(db);
    consola.verbose(`🌱 INSERT user (id: ${marie_bon})`);

    //

    const dinum = await insert_dinum(db);
    consola.verbose(`🌱 INSERT organization ${dinum.cached_nom_complet}`);
    const aldp = await insert_aldp(db);
    consola.verbose(`🌱 INSERT organization ${aldp.cached_nom_complet}`);
    const abracadabra = await insert_abracadabra(db);
    consola.verbose(`🌱 INSERT organization ${abracadabra.cached_nom_complet}`);
    const dengi = await insert_dengi(db);
    consola.verbose(`🌱 INSERT organization ${dengi.cached_nom_complet}`);
    const bosch_france = await insert_bosch_france(db);
    consola.verbose(`🌱 INSERT organization (id: ${bosch_france})`);
    const bosch_rexroth = await insert_bosch_rexroth(db);
    consola.verbose(`🌱 INSERT organization (id: ${bosch_rexroth})`);

    const sak = await insert_sak(db);
    consola.verbose(`🌱 INSERT organization ${sak.cached_nom_complet}`);
    const yes_we_hack = await insert_yes_we_hack(db);
    consola.verbose(`🌱 INSERT organization yes_we_hack (id: ${yes_we_hack})`);
    const commune_de_pompierre = await insert_commune_de_pompierre(db);
    consola.verbose(
      `🌱 INSERT organization commune_de_pompierre (id: ${commune_de_pompierre})`,
    );

    //

    await insert_users_organizations(db, {
      organization_id: dinum.id,
      user_id: raphael.id,
    });
    consola.verbose(
      `🌱 INSERT ${raphael.given_name} join ${dinum.cached_libelle} `,
    );

    await insert_users_organizations(db, {
      organization_id: bosch_rexroth,
      user_id: marie_bon,
    });
    consola.verbose(`🌱 INSERT ${marie_bon} join ${bosch_rexroth}`);

    //

    await insert_moderation(db, {
      created_at: "2011-11-11T12:11:11+02:00",
      organization_id: dinum.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: jean_bon.id,
      ticket_id: "115793",
    });
    consola.verbose(
      `🌱 INSERT ${jean_bon.given_name} wants to join ${dinum.cached_libelle}`,
    );

    await insert_moderation(db, {
      created_at: "2011-11-11T01:02:59+02:00",
      organization_id: abracadabra.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: jean_bon.id,
      ticket_id: "session_456",
    });
    consola.verbose(
      `🌱 INSERT ${jean_bon.given_name} wants to join ${abracadabra.cached_libelle}`,
    );

    await insert_moderation(db, {
      created_at: "2011-11-11T01:03:15+02:00",
      organization_id: abracadabra.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: jean_dre.id,
      ticket_id: "session_789",
    });
    consola.verbose(
      `🌱 INSERT ${jean_dre.given_name} wants to join ${abracadabra.cached_libelle}`,
    );

    await insert_moderation(db, {
      organization_id: aldp.id,
      type: "big_organization_join" as MCP_Moderation["type"],
      user_id: pierre_bon.id,
    });
    consola.verbose(
      `🌱 INSERT ${pierre_bon.family_name} wants to join  ${aldp.cached_libelle}`,
    );

    await insert_moderation(db, {
      organization_id: dengi.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: richard_bon.id,
      moderated_at: "2023-06-22T16:34:34+02:00",
      ticket_id: "session_789",
    });
    consola.verbose(
      `🌱 INSERT ${richard_bon.given_name} wants to join ${dengi.cached_nom_complet}`,
    );

    await insert_moderation(db, {
      organization_id: dengi.id,
      type: "organization_join_block" as MCP_Moderation["type"],
      user_id: richard_bon.id,
      ticket_id: "session_321",
    });
    consola.verbose(
      `🌱 INSERT ${richard_bon.given_name} wants to join ${dengi.cached_nom_complet} again...`,
    );

    await insert_moderation(db, {
      organization_id: bosch_france,
      type: "non_verified_domain" as MCP_Moderation["type"],
      user_id: marie_bon,
      ticket_id: "session_654",
    });
    consola.verbose(
      `🌱 INSERT ${marie_bon} wants to join ${bosch_france} again...`,
    );

    await insert_moderation(db, {
      created_at: "2011-11-12T12:11:12+02:00",
      organization_id: bosch_rexroth,
      type: "non_verified_domain" as MCP_Moderation["type"],
      user_id: marie_bon,
      moderated_at: "2023-06-22T16:34:34+02:00",
      ticket_id: "session_987",
    });
    consola.verbose(
      `🌱 INSERT ${marie_bon} wants to join ${bosch_rexroth} again...`,
    );
    await insert_moderation(db, {
      organization_id: dinum.id,
      type: "non_verified_domain" as MCP_Moderation["type"],
      user_id: raphael_alpha.id,
      moderated_at: "2023-06-22T16:34:34+02:00",
      ticket_id: "session_111",
    });
    consola.verbose(
      `🌱 INSERT ${raphael_alpha.given_name} wants to join ${dinum.cached_nom_complet} again...`,
    );
  } catch (err) {
    console.error("Something went wrong...");
    console.error(err);
  }
}

//

function insert_moderation(
  db: IdentiteProconnect_PgDatabase,
  insert_moderation: typeof schema.moderations.$inferInsert,
) {
  return db.insert(schema.moderations).values(insert_moderation);
}

function insert_users_organizations(
  db: IdentiteProconnect_PgDatabase,
  insert_users_organizations: typeof schema.users_organizations.$inferInsert,
) {
  return db
    .insert(schema.users_organizations)
    .values(insert_users_organizations);
}
