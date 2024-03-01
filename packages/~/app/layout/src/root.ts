//

import config from "@~/app.core/config";
import { html } from "hono/html";
import type { PropsWithChildren } from "hono/jsx";

//

export interface Root_Layout_Props {
  nonce?: string | undefined;
}

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: Root_Layout_Props): Response;
  }
}

export function Root_Layout({
  children,
  nonce,
}: PropsWithChildren<Root_Layout_Props>) {
  return html`
    <html
      lang="fr"
      data-fr-scheme="system"
      hx-ext="${[
        config.NODE_ENV === "production" ? "" : "debug",
        "chunked-transfer",
        "include-vals",
      ].join(", ")}"
    >
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
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="shortcut icon"
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="manifest"
          href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/favicon/manifest.webmanifest"
          crossorigin="use-credentials"
        />

        <!--  -->

        <link
          rel="stylesheet"
          href="${config.ASSETS_PATH}/node_modules/animate.css/source/_vars.css"
        />

        <!--  -->

        ${config.NODE_ENV === "development"
          ? html`<link
              rel="stylesheet"
              href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.css"
            />`
          : html`<link
              rel="stylesheet"
              href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css"
            />`}

        <!--  -->

        <link
          rel="stylesheet"
          href="${config.ASSETS_PATH}/public/assets/tailwind.css"
        />

        <!--  -->

        <script
          hash="sha256-ZtVO4euNrRnx0KrqoCatLuOIaHv1Z7zi++KgINh8SqM="
          nonce="${nonce ?? ""}"
          type="importmap"
        >
          {
            "imports": {
              "@~/app.core/config": "${config.ASSETS_PATH}/bundle/config.js",
              ":common/env.ts": "${config.ASSETS_PATH}/bundle/env.js",
              "lit": "${config.ASSETS_PATH}/bundle/lit.js",
              "lit/": "${config.ASSETS_PATH}/bundle/lit/"
            }
          }
        </script>

        <title>
          H${Array.from({ length: Math.max(3, Math.random() * 5) })
            .fill("y")
            .join("") + "pertool"}
        </title>
      </head>
      <body
        _="
          on every htmx:beforeSend NProgress.start()
          on every htmx:afterOnLoad NProgress.done()
          on every htmx:afterSettle NProgress.done()
        "
        class="flex min-h-screen flex-col"
      >
        <div class="flex flex-1 flex-col">${children}</div>
        <footer class="container mx-auto flex flex-row justify-between p-2">
          <div>© ${new Date().getFullYear()} 🇫🇷</div>
          <a
            href=${`https://github.com/betagouv/hyyypertool/tree/${config.VERSION}`}
            rel="noopener noreferrer"
            target="_blank"
            safe
          >
            <small>version ${config.VERSION}</small>
          </a>
        </footer>
      </body>

      <!--  -->

      ${config.NODE_ENV === "development"
        ? html`<script
            nonce="${nonce ?? ""}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/htmx.js"
            type="module"
          ></script>`
        : html`<script
            nonce="${nonce ?? ""}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/htmx.min.js"
            type="module"
          ></script>`}

      <meta
        name="htmx-config"
        content="${JSON.stringify({
          defaultSettleDelay: 0,
          globalViewTransitions: true,
          historyEnabled: true,
          inlineScriptNonce: nonce ?? "",
        })}"
      />

      ${config.DEPLOY_ENV === "preview"
        ? html`<script
            nonce="${nonce ?? ""}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/ext/debug.js"
            type="module"
          ></script>`
        : ""}

      <script
        nonce="${nonce ?? ""}"
        src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/ext/include-vals.js"
        type="module"
      ></script>
      <script
        nonce="${nonce ?? ""}"
        src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/ext/sse.js"
        type="module"
      ></script>
      <script
        nonce="${nonce ?? ""}"
        src="${config.ASSETS_PATH}/node_modules/htmx.ext...chunked-transfer/dist/index.js"
        type="module"
      ></script>

      <!--  -->

      ${config.NODE_ENV === "development"
        ? html`<script
              nonce="${nonce ?? ""}"
              src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/_hyperscript.js"
            ></script>

            <script
              nonce="${nonce ?? ""}"
              src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/hdb.js"
            ></script>`
        : html`<script
            nonce="${nonce ?? ""}"
            src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/_hyperscript.min.js"
          ></script> `}

      <!--  -->

      <script
        nonce="${nonce ?? ""}"
        src="${config.ASSETS_PATH}/node_modules/nprogress/nprogress.js"
      ></script>

      <link
        rel="stylesheet"
        href="${config.ASSETS_PATH}/node_modules/nprogress/nprogress.css"
      />

      <!--  -->
    </html>
  `;
}
