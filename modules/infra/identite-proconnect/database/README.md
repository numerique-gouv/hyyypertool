# Drizzle introspect schema for [identite](https://identite.beta.gouv.fr/)

## Usage

```sh
# Change the DATABASE_URL to match the identite sandbox or a local identite database.

# Remove the existing drizzle folder to ignore migration between models.
$ rm -rf src/drizzle

# One can use a scalingo tunnel to pull from an existing running database
$ scalingo --app identite-preprod --region osc-secnum-fr1 db-tunnel --identity ~/.ssh/scalingo SCALINGO_POSTGRESQL_URL

# Pull the new schema
$ bun x drizzle-kit introspect

# Test database connection with the studio
$ bun x drizzle-kit studio
drizzle-kit: v0.21.2
drizzle-orm: v0.30.10

No config path provided, using default path
Reading config file '/home/x/zzz/github/numerique-gouv/hyyypertool/modules/infra/identite-proconnect/database/drizzle.config.ts'
Using 'pg' driver for database querying

# [...]

Drizzle Studio is up and running on https://local.drizzle.studio


# Format the generated code
$ bun x prettier -w .

# Fixing varchar("xxxxxx", { length:  }) error : remove ", { length:  }"
$ sed -i 's/, { length:  }//g' src/drizzle/schema.ts
$ bun x prettier -w .

# Fixing timestamp("xxxxxx").default('1970-01-01 00:00:00'::timestamp without time zone) error : replace by .defaultNow()
$ sed -i "s/.default('1970-01-01 00:00:00'::timestamp without time zone)/.defaultNow()/g" src/drizzle/schema.ts
$ bun x prettier -w .

# You might want to use an empty database to
$ docker compose stop
$ docker volume rm identite_postgres
$ docker compose up --build --detach

# Uncomment the generated database/src/drizzle/0000_xxxxxxx.sql snapshot
# And run the migration on your local empty database
$ bun run migration

# Run and update the seed if neccessary
$ bun run seed


```

## Initialization Log

```sh
# Initial
$ cd ___identite___
$ docker compose up
$ docker compose exec -T postgres pg_restore --clean --no-owner --dbname postgres --user postgres < identite-staging-database_XXXXXXXXXXXXXX.sql

$ bun x drizzle-kit introspect:pg --config src/database/identite-proconnect/drizzle.config.ts
drizzle-kit: v0.20.7
drizzle-orm: v0.29.1

Custom config path was provided, using 'src/database/identite-proconnect/drizzle.config.ts'
Reading config file '/home/x/zzz/github/numerique-gouv/hyyypertool/src/database/identite-proconnect/drizzle.config.ts'
[✓] 7  tables fetched
[✓] 88 columns fetched
[✓] 0  enums fetched
[✓] 3  indexes fetched
[✓] 8  foreign keys fetched

[✓] Your SQL migration file ➜ src/database/identite-proconnect/drizzle/0000_faulty_oracle.sql 🚀
[✓] You schema file is ready ➜ src/database/identite-proconnect/drizzle/schema.ts 🚀

$ bun x prettier -w src/database
# Fixing varchar("xxxxxx", { length:  }) error : remove ", { length:  }"
# Fixing timestamp("xxxxxx").default('1970-01-01 00:00:00'::timestamp without time zone) error : replace by .defaultNow()
# Fixing unknown("credential_public_key") : replace by text()"credential_public_key")

$ bun x drizzle-kit studio --config src/database/identite-proconnect/drizzle.config.ts
# Confirm that the database is explorable :)

# [...]

# Fixing introspect timestamp("xxxxxx") with no {mode: string}
# Fixing explicit one to one relation on moderation table

```
