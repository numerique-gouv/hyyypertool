/// <reference types="@kitajs/html/htmx.d.ts" />

//

import env from ":env";
import { html } from "@elysiajs/html";
import Elysia from "elysia";
import explorer_index from "./www/explorer/index";
import www_index from "./www/index";
import legacy_index from "./www/legacy/index";
import login_index from "./www/login/index";

export const www = new Elysia()
  .use(html())
  .group("/public", function virtuak_public_folder(app) {
    return (
      app
        .onRequest(function cache_control({ set }) {
          set.headers["Cache-Control"] =
            env.NODE_ENV === "production"
              ? "public, max-age=31536000, immutable"
              : "max-age=6000";
        })
        .get("/tailwind/*", ({ params: { ["*"]: file_path } }) =>
          Bun.file(`public/tailwind/${file_path}`),
        )
        .get("/@gouvfr/dsfr/dist/*", ({ params: { ["*"]: file_path } }) =>
          Bun.file(`node_modules/@gouvfr/dsfr/dist/${file_path}`),
        )
        .get("/animate.css/*", ({ params: { ["*"]: file_path } }) =>
          Bun.file(`node_modules/animate.css/${file_path}`),
        )
        .get("/animate.css/source/*", ({ params: { ["*"]: file_path } }) =>
          Bun.file(`node_modules/animate.css/source/${file_path}`),
        )
        //
        .get("/lit", async () => {
          const {
            outputs: [output],
          } = await Bun.build({
            entrypoints: [Bun.resolveSync(`lit`, process.cwd())],
            minify: env.NODE_ENV === "production",
          });
          return new Response(output);
        })
        .get("/lit/*", async ({ params: { ["*"]: file_path } }) => {
          const {
            outputs: [output],
          } = await Bun.build({
            entrypoints: [Bun.resolveSync(`lit/${file_path}`, process.cwd())],
            minify: env.NODE_ENV === "production",
          });
          return new Response(output);
        })
        .get("/htmx.org/dist/htmx.js", async () => {
          const {
            outputs: [output],
          } = await Bun.build({
            entrypoints: [
              Bun.resolveSync("htmx.org/dist/htmx.js", process.cwd()),
            ],
            minify: env.NODE_ENV === "production",
          });
          return new Response(output);
        })
        .get("/hyperscript.org/dist/_hyperscript.js", async () => {
          const {
            outputs: [output],
          } = await Bun.build({
            entrypoints: [
              Bun.resolveSync(
                "hyperscript.org/dist/_hyperscript.js",
                process.cwd(),
              ),
            ],
            minify: env.NODE_ENV === "production",
          });
          return new Response(output);
        })
    );
  });

//

www.use((app) => {
  return app
    .use(www_index)
    .group("/login", (app) => app.use(login_index))
    .group("/explorer", (app) => app.use(explorer_index))
    .group("/legacy", (app) => app.use(legacy_index));
});

//

export type ElysiaWWW = typeof www;

//
