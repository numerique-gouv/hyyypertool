//

import env from ":env";
import { html } from "hono/html";
import type { Child } from "hono/jsx";

//

export function Root_Layout({ children }: { children?: Child }) {
  return (
    <html lang="fr" data-fr-scheme="system">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#000091" />

        <link
          rel="apple-touch-icon"
          href="/node_modules/@gouvfr/dsfr/dist/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          href="/node_modules/@gouvfr/dsfr/dist/favicon/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="shortcut icon"
          href="/node_modules/@gouvfr/dsfr/dist/favicon/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="manifest"
          href="/node_modules/@gouvfr/dsfr/dist/favicon/manifest.webmanifest"
          crossorigin="use-credentials"
        />

        <link
          rel="stylesheet"
          href="/node_modules/animate.css/source/_vars.css"
        />

        <link rel="stylesheet" href="/public/tailwind/styles.css" />

        <link
          rel="stylesheet"
          href="/node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.css"
        />

        {html`
          <script type="importmap" type="application/json">
            {
              "imports": {
                "public/client/hyyypertitle.js": "/public/client/hyyypertitle.js",
                "lit": "/bundle/lit.js",
                "lit/": "/bundle/lit/"
              }
            }
          </script>
        `}

        <script type="module" src="/node_modules/htmx.org/dist/htmx.js" />
        <meta
          name="htmx-config"
          content='{"historyEnabled":true,"defaultSettleDelay":0}'
        />
        {env.DEPLOY_ENV === "preview" ? (
          <script
            type="module"
            src="/node_modules/htmx.org/dist/ext/debug.js"
          />
        ) : null}
        <script
          type="module"
          src="/node_modules/htmx.org/dist/ext/include-vals.js"
        />
        <script
          type="module"
          src="/node_modules/hyperscript.org/dist/_hyperscript.min.js"
        />

        <title>
          H{Array.from({ length: Math.max(3, Math.random() * 5) }).fill("y")}
          pertool
        </title>
      </head>
      <body class="flex min-h-screen flex-col" hx-ext="include-vals">
        <div class="flex flex-1 flex-col">{children}</div>
        <footer class="container mx-auto flex flex-row justify-between p-2">
          <div>© {new Date().getFullYear()} 🇫🇷 </div>
          <a
            href={`https://github.com/betagouv/hyyypertool/tree/v${env.VERSION}`}
            rel="noopener noreferrer"
            target="_blank"
            safe
          >
            v{env.VERSION}
          </a>
        </footer>
      </body>
    </html>
  );
}
