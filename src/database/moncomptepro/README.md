# Drizzle introspect schema for [moncomptepro](https://moncomptepro.beta.gouv.fr/)

## Initialization Log

```sh
# Initial
$ cd ___moncomptepro___
$ docker compose up

$ bun x drizzle-kit introspect:pg --config src/database/moncomptepro/drizzle.config.ts
drizzle-kit: v0.20.7
drizzle-orm: v0.29.1

Custom config path was provided, using 'src/database/moncomptepro/drizzle.config.ts'
Reading config file '/home/x/zzz/github/betagouv/hyyypertool/src/database/moncomptepro/drizzle.config.ts'
[✓] 7  tables fetched
[✓] 88 columns fetched
[✓] 0  enums fetched
[✓] 3  indexes fetched
[✓] 8  foreign keys fetched

[✓] Your SQL migration file ➜ src/database/moncomptepro/drizzle/0000_faulty_oracle.sql 🚀
[✓] You schema file is ready ➜ src/database/moncomptepro/drizzle/schema.ts 🚀

$ bun x prettier -w src/database
# Fixing varchar("xxxxxx", { length:  }) error
# Fixing timestamp("xxxxxx").default('1970-01-01 00:00:00'::timestamp without time zone) error

$ bun x drizzle-kit studio --config src/database/moncomptepro/drizzle.config.ts
# Confirm that the database is explorable :)

# [...]

# Fixing introspect timestamp("xxxxxx") with no {mode: string}
# Fixing explicit one to one relation on moderation table

```
