# Hyyypertool

<p align="center">
    <img src=".github/Charco - Security.png">
</p>

> Backoffice moderation tool for MonComptePro

## Install

First, you need bun to be installed: https://bun.sh/

Then install dependencies with: `bun install`.

Build it: `bun run build`.

Start the moncomptepro database with: `docker compose up -d`

Ask a colleague for a database dump, then import it with:

```
docker compose exec -T postgres-moncomptepro pg_restore --clean --no-owner --dbname postgres --user postgres < moncomptepro-staging-database_20231114103427.sql
```

Then run the app: `bun run dev`.

Then go to http://localhost:3000/.

## Deployment 🚀

You need to create a release, for that:

Go to the [Hyyypertool](https://github.com/numerique-gouv/hyyypertool/actions) repository

Go to the ‘Actions’ tab, click on 'Release it!'

Run the workflow from the master branch

Once the release is complete, go to [Hyyypertool Sandbox](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool-sandbox) Scalingo

Manually deploy the release branch (the branch name looks like: release/year.month.number)

Repeat the same action in the [Hyypertool production](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool) Scalingo

Finally, you need to make a summary note in the ProConnect general channel and pin the message.
