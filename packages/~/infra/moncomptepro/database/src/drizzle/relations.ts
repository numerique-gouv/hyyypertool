import { relations } from "drizzle-orm/relations";
import {
  email_domains,
  moderations,
  oidc_clients,
  organizations,
  users,
  users_oidc_clients,
  users_organizations,
} from "./schema";

export const users_oidc_clientsRelations = relations(
  users_oidc_clients,
  ({ one }) => ({
    user: one(users, {
      fields: [users_oidc_clients.user_id],
      references: [users.id],
    }),
    oidc_client: one(oidc_clients, {
      fields: [users_oidc_clients.oidc_client_id],
      references: [oidc_clients.id],
    }),
    organization: one(organizations, {
      fields: [users_oidc_clients.organization_id],
      references: [organizations.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  users_oidc_clients: many(users_oidc_clients),
  moderations: many(moderations),
  users_organizations_user_id: many(users_organizations, {
    relationName: "users_organizations_user_id_users_id",
  }),
  users_organizations_sponsor_id: many(users_organizations, {
    relationName: "users_organizations_sponsor_id_users_id",
  }),
}));

export const oidc_clientsRelations = relations(oidc_clients, ({ many }) => ({
  users_oidc_clients: many(users_oidc_clients),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users_oidc_clients: many(users_oidc_clients),
  moderations: many(moderations),
  email_domains: many(email_domains),
  users_organizations: many(users_organizations),
}));

export const moderationsRelations = relations(moderations, ({ one }) => ({
  user: one(users, {
    fields: [moderations.user_id],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [moderations.organization_id],
    references: [organizations.id],
  }),
}));

export const email_domainsRelations = relations(email_domains, ({ one }) => ({
  organization: one(organizations, {
    fields: [email_domains.organization_id],
    references: [organizations.id],
  }),
}));

export const users_organizationsRelations = relations(
  users_organizations,
  ({ one }) => ({
    user_user_id: one(users, {
      fields: [users_organizations.user_id],
      references: [users.id],
      relationName: "users_organizations_user_id_users_id",
    }),
    organization: one(organizations, {
      fields: [users_organizations.organization_id],
      references: [organizations.id],
    }),
    user_sponsor_id: one(users, {
      fields: [users_organizations.sponsor_id],
      references: [users.id],
      relationName: "users_organizations_sponsor_id_users_id",
    }),
  }),
);

export {
  email_domains,
  moderations,
  oidc_clients,
  organizations,
  users,
  users_oidc_clients,
  users_organizations,
};
