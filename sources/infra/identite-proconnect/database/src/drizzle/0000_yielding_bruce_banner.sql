-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE SEQUENCE "public"."pgmigrations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "email_domains" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer NOT NULL,
	"domain" varchar(255) NOT NULL,
	"verification_type" varchar(255),
	"can_be_suggested" boolean DEFAULT true NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "unique_organization_domain" UNIQUE("organization_id","domain","verification_type")
);
--> statement-breakpoint
CREATE TABLE "authenticators" (
	"credential_id" text PRIMARY KEY NOT NULL,
	"credential_public_key" "bytea" NOT NULL,
	"counter" bigint NOT NULL,
	"credential_device_type" varchar(32),
	"credential_backed_up" boolean NOT NULL,
	"transports" varchar(255)[] DEFAULT '{""}',
	"user_id" integer NOT NULL,
	"display_name" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"user_verified" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"type" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"moderated_at" timestamp with time zone,
	"comment" varchar,
	"moderated_by" varchar,
	"ticket_id" text
);
--> statement-breakpoint
CREATE TABLE "oidc_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar NOT NULL,
	"client_id" varchar NOT NULL,
	"client_secret" varchar NOT NULL,
	"redirect_uris" varchar[] DEFAULT '{""}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"post_logout_redirect_uris" varchar[] DEFAULT '{""}' NOT NULL,
	"scope" varchar DEFAULT 'openid email' NOT NULL,
	"client_uri" varchar,
	"client_description" varchar,
	"userinfo_signed_response_alg" varchar,
	"id_token_signed_response_alg" varchar,
	"authorization_signed_response_alg" varchar,
	"introspection_signed_response_alg" varchar,
	"is_proconnect_federation" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"siret" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00' NOT NULL,
	"cached_libelle" varchar,
	"cached_nom_complet" varchar,
	"cached_enseigne" varchar,
	"cached_tranche_effectifs" varchar,
	"cached_tranche_effectifs_unite_legale" varchar,
	"cached_libelle_tranche_effectif" varchar,
	"cached_etat_administratif" varchar,
	"cached_est_active" boolean,
	"cached_statut_diffusion" varchar,
	"cached_est_diffusible" boolean,
	"cached_adresse" varchar,
	"cached_code_postal" varchar,
	"cached_activite_principale" varchar,
	"cached_libelle_activite_principale" varchar,
	"cached_categorie_juridique" varchar,
	"cached_libelle_categorie_juridique" varchar,
	"organization_info_fetched_at" timestamp with time zone,
	"cached_code_officiel_geographique" varchar
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar DEFAULT '' NOT NULL,
	"encrypted_password" varchar DEFAULT '',
	"reset_password_token" varchar,
	"reset_password_sent_at" timestamp with time zone,
	"sign_in_count" integer DEFAULT 0 NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"verify_email_token" varchar,
	"verify_email_sent_at" timestamp with time zone,
	"given_name" varchar,
	"family_name" varchar,
	"phone_number" varchar,
	"job" varchar,
	"magic_link_token" varchar,
	"magic_link_sent_at" timestamp with time zone,
	"email_verified_at" timestamp with time zone,
	"current_challenge" varchar,
	"needs_inclusionconnect_welcome_page" boolean DEFAULT false NOT NULL,
	"needs_inclusionconnect_onboarding_help" boolean DEFAULT false NOT NULL,
	"encrypted_totp_key" varchar,
	"totp_key_verified_at" timestamp with time zone,
	"force_2fa" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_oidc_clients" (
	"user_id" integer NOT NULL,
	"oidc_client_id" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer
);
--> statement-breakpoint
CREATE TABLE "users_organizations" (
	"user_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"is_external" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00' NOT NULL,
	"verification_type" varchar,
	"has_been_greeted" boolean DEFAULT false NOT NULL,
	"needs_official_contact_email_verification" boolean DEFAULT false NOT NULL,
	"official_contact_email_verification_token" varchar,
	"official_contact_email_verification_sent_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	CONSTRAINT "users_organizations_pkey" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
ALTER TABLE "email_domains" ADD CONSTRAINT "email_domains_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderations" ADD CONSTRAINT "moderations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderations" ADD CONSTRAINT "moderations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_oidc_clients" ADD CONSTRAINT "users_oidc_clients_oidc_client_id_fkey" FOREIGN KEY ("oidc_client_id") REFERENCES "public"."oidc_clients"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_oidc_clients" ADD CONSTRAINT "users_oidc_clients_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_oidc_clients" ADD CONSTRAINT "users_oidc_clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "index_authenticators_on_credential_id" ON "authenticators" USING btree ("credential_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_organizations_on_siret" ON "organizations" USING btree ("siret" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_users_on_email" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_users_on_reset_password_token" ON "users" USING btree ("reset_password_token" text_ops);
