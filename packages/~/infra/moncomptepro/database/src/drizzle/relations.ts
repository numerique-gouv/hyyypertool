import { relations } from "drizzle-orm/relations";
import { organizations, email_domains, users, authenticators, moderations, oidc_clients, users_oidc_clients, users_organizations } from "./schema";

export const email_domainsRelations = relations(email_domains, ({one}) => ({
	organization: one(organizations, {
		fields: [email_domains.organization_id],
		references: [organizations.id]
	}),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	email_domains: many(email_domains),
	moderations: many(moderations),
	users_oidc_clients: many(users_oidc_clients),
	users_organizations: many(users_organizations),
}));

export const authenticatorsRelations = relations(authenticators, ({one}) => ({
	user: one(users, {
		fields: [authenticators.user_id],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	authenticators: many(authenticators),
	moderations: many(moderations),
	users_oidc_clients: many(users_oidc_clients),
	users_organizations: many(users_organizations),
}));

export const moderationsRelations = relations(moderations, ({one}) => ({
	organization: one(organizations, {
		fields: [moderations.organization_id],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [moderations.user_id],
		references: [users.id]
	}),
}));

export const users_oidc_clientsRelations = relations(users_oidc_clients, ({one}) => ({
	oidc_client: one(oidc_clients, {
		fields: [users_oidc_clients.oidc_client_id],
		references: [oidc_clients.id]
	}),
	organization: one(organizations, {
		fields: [users_oidc_clients.organization_id],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [users_oidc_clients.user_id],
		references: [users.id]
	}),
}));

export const oidc_clientsRelations = relations(oidc_clients, ({many}) => ({
	users_oidc_clients: many(users_oidc_clients),
}));

export const users_organizationsRelations = relations(users_organizations, ({one}) => ({
	organization: one(organizations, {
		fields: [users_organizations.organization_id],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [users_organizations.user_id],
		references: [users.id]
	}),
}));