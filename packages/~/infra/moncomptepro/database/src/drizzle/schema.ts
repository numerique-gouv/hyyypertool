import {
  pgTable,
  foreignKey,
  serial,
  integer,
  varchar,
  timestamp,
  uniqueIndex,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const moderations = pgTable("moderations", {
  id: serial("id").primaryKey().notNull(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organization_id: integer("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  moderated_at: timestamp("moderated_at", {
    withTimezone: true,
    mode: "string",
  }),
  comment: varchar("comment"),
  ticket_id: integer("ticket_id"),
  moderated_by: varchar("moderated_by"),
});

export const oidc_clients = pgTable("oidc_clients", {
  id: serial("id").primaryKey().notNull(),
  client_name: varchar("client_name").notNull(),
  client_id: varchar("client_id").notNull(),
  client_secret: varchar("client_secret").notNull(),
  redirect_uris: varchar("redirect_uris").default("{}").array().notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  post_logout_redirect_uris: varchar("post_logout_redirect_uris")
    .default("{}")
    .array()
    .notNull(),
  scope: varchar("scope").default("openid email").notNull(),
  client_uri: varchar("client_uri"),
  client_description: varchar("client_description"),
  userinfo_signed_response_alg: varchar("userinfo_signed_response_alg"),
  id_token_signed_response_alg: varchar("id_token_signed_response_alg"),
  authorization_signed_response_alg: varchar(
    "authorization_signed_response_alg",
  ),
  introspection_signed_response_alg: varchar(
    "introspection_signed_response_alg",
  ),
});

export const organizations = pgTable(
  "organizations",
  {
    id: serial("id").primaryKey().notNull(),
    siret: varchar("siret").notNull(),
    authorized_email_domains: varchar("authorized_email_domains")
      .default("{}")
      .array()
      .notNull(),
    external_authorized_email_domains: varchar(
      "external_authorized_email_domains",
    )
      .default("{}")
      .array()
      .notNull(),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    cached_libelle: varchar("cached_libelle"),
    cached_nom_complet: varchar("cached_nom_complet"),
    cached_enseigne: varchar("cached_enseigne"),
    cached_tranche_effectifs: varchar("cached_tranche_effectifs"),
    cached_tranche_effectifs_unite_legale: varchar(
      "cached_tranche_effectifs_unite_legale",
    ),
    cached_libelle_tranche_effectif: varchar("cached_libelle_tranche_effectif"),
    cached_etat_administratif: varchar("cached_etat_administratif"),
    cached_est_active: boolean("cached_est_active"),
    cached_statut_diffusion: varchar("cached_statut_diffusion"),
    cached_est_diffusible: boolean("cached_est_diffusible"),
    cached_adresse: varchar("cached_adresse"),
    cached_code_postal: varchar("cached_code_postal"),
    cached_activite_principale: varchar("cached_activite_principale"),
    cached_libelle_activite_principale: varchar(
      "cached_libelle_activite_principale",
    ),
    cached_categorie_juridique: varchar("cached_categorie_juridique"),
    cached_libelle_categorie_juridique: varchar(
      "cached_libelle_categorie_juridique",
    ),
    organization_info_fetched_at: timestamp("organization_info_fetched_at", {
      withTimezone: true,
      mode: "string",
    }),
    verified_email_domains: varchar("verified_email_domains")
      .default("{}")
      .array()
      .notNull(),
    cached_code_officiel_geographique: varchar(
      "cached_code_officiel_geographique",
    ),
    trackdechets_email_domains: varchar("trackdechets_email_domains")
      .default("{}")
      .array()
      .notNull(),
  },
  (table) => {
    return {
      index_organizations_on_siret: uniqueIndex(
        "index_organizations_on_siret",
      ).on(table.siret),
    };
  },
);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey().notNull(),
    email: varchar("email").default("").notNull(),
    encrypted_password: varchar("encrypted_password").default(""),
    reset_password_token: varchar("reset_password_token"),
    reset_password_sent_at: timestamp("reset_password_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    sign_in_count: integer("sign_in_count").default(0).notNull(),
    last_sign_in_at: timestamp("last_sign_in_at", {
      withTimezone: true,
      mode: "string",
    }),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updated_at: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    email_verified: boolean("email_verified").default(false).notNull(),
    verify_email_token: varchar("verify_email_token"),
    verify_email_sent_at: timestamp("verify_email_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    given_name: varchar("given_name"),
    family_name: varchar("family_name"),
    phone_number: varchar("phone_number"),
    job: varchar("job"),
    magic_link_token: varchar("magic_link_token"),
    magic_link_sent_at: timestamp("magic_link_sent_at", {
      withTimezone: true,
      mode: "string",
    }),
    email_verified_at: timestamp("email_verified_at", {
      withTimezone: true,
      mode: "string",
    }),
    current_challenge: varchar("current_challenge"),
    needs_inclusionconnect_welcome_page: boolean(
      "needs_inclusionconnect_welcome_page",
    )
      .default(false)
      .notNull(),
    needs_inclusionconnect_onboarding_help: boolean(
      "needs_inclusionconnect_onboarding_help",
    )
      .default(false)
      .notNull(),
  },
  (table) => {
    return {
      index_users_on_email: uniqueIndex("index_users_on_email").on(table.email),
      index_users_on_reset_password_token: uniqueIndex(
        "index_users_on_reset_password_token",
      ).on(table.reset_password_token),
    };
  },
);

export const users_oidc_clients = pgTable("users_oidc_clients", {
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  oidc_client_id: integer("oidc_client_id")
    .notNull()
    .references(() => oidc_clients.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  id: serial("id").primaryKey().notNull(),
  organization_id: integer("organization_id").references(
    () => organizations.id,
    { onDelete: "set null", onUpdate: "cascade" },
  ),
});

export const users_organizations = pgTable(
  "users_organizations",
  {
    user_id: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    organization_id: integer("organization_id")
      .notNull()
      .references(() => organizations.id, { onUpdate: "cascade" }),
    is_external: boolean("is_external").default(false).notNull(),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    verification_type: varchar("verification_type"),
    authentication_by_peers_type: varchar("authentication_by_peers_type"),
    has_been_greeted: boolean("has_been_greeted").default(false).notNull(),
    sponsor_id: integer("sponsor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    needs_official_contact_email_verification: boolean(
      "needs_official_contact_email_verification",
    )
      .default(false)
      .notNull(),
    official_contact_email_verification_token: varchar(
      "official_contact_email_verification_token",
    ),
    official_contact_email_verification_sent_at: timestamp(
      "official_contact_email_verification_sent_at",
      { withTimezone: true, mode: "string" },
    ),
  },
  (table) => {
    return {
      users_organizations_pkey: primaryKey({
        columns: [table.user_id, table.organization_id],
        name: "users_organizations_pkey",
      }),
    };
  },
);
