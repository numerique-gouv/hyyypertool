-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

CREATE TABLE IF NOT EXISTS "moderations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"type" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"moderated_at" timestamp with time zone,
	"comment" varchar,
	"ticket_id" integer,
	"moderated_by" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oidc_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar NOT NULL,
	"client_id" varchar NOT NULL,
	"client_secret" varchar NOT NULL,
	"redirect_uris" varchar[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"post_logout_redirect_uris" varchar[] DEFAULT '{}' NOT NULL,
	"scope" varchar DEFAULT 'openid email' NOT NULL,
	"client_uri" varchar,
	"client_description" varchar,
	"userinfo_signed_response_alg" varchar,
	"id_token_signed_response_alg" varchar,
	"authorization_signed_response_alg" varchar,
	"introspection_signed_response_alg" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"siret" varchar NOT NULL,
	"authorized_email_domains" varchar[] DEFAULT '{}' NOT NULL,
	"external_authorized_email_domains" varchar[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00'::timestamp without time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00'::timestamp without time zone NOT NULL,
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
	"verified_email_domains" varchar[] DEFAULT '{}' NOT NULL,
	"cached_code_officiel_geographique" varchar,
	"trackdechets_email_domains" varchar[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
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
	"needs_inclusionconnect_onboarding_help" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_oidc_clients" (
	"user_id" integer NOT NULL,
	"oidc_client_id" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_organizations" (
	"user_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	"is_external" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00'::timestamp without time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT '1970-01-01 00:00:00'::timestamp without time zone NOT NULL,
	"verification_type" varchar,
	"authentication_by_peers_type" varchar,
	"has_been_greeted" boolean DEFAULT false NOT NULL,
	"sponsor_id" integer,
	"needs_official_contact_email_verification" boolean DEFAULT false NOT NULL,
	"official_contact_email_verification_token" varchar,
	"official_contact_email_verification_sent_at" timestamp with time zone,
	CONSTRAINT "users_organizations_pkey" PRIMARY KEY("user_id","organization_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moderations" ADD CONSTRAINT "moderations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moderations" ADD CONSTRAINT "moderations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_oidc_clients" ADD CONSTRAINT "users_oidc_clients_oidc_client_id_fkey" FOREIGN KEY ("oidc_client_id") REFERENCES "public"."oidc_clients"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_oidc_clients" ADD CONSTRAINT "users_oidc_clients_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_oidc_clients" ADD CONSTRAINT "users_oidc_clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_sponsor_id_fkey" FOREIGN KEY ("sponsor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_organizations" ADD CONSTRAINT "users_organizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "index_organizations_on_siret" ON "organizations" ("siret");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "index_users_on_email" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "index_users_on_reset_password_token" ON "users" ("reset_password_token");
