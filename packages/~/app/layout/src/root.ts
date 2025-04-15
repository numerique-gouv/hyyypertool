//

import type { App_Context } from "@~/app.middleware/context";
import { html } from "hono/html";
import type { PropsWithChildren } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export function Root_Layout({ children }: PropsWithChildren) {
  const {
    var: { config, nonce, sentry_trace_meta_tags },
  } = useRequestContext<App_Context>();

  return html`
    <html
      lang="fr"
      data-fr-scheme="system"
      hx-ext="${[
        config.NODE_ENV === "production" ? "" : "debug",
        "chunked-transfer",
        "include-vals",
      ]
        .filter(Boolean)
        .join(", ")}"
    >
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#000091" />

        <!--  -->
        ${sentry_trace_meta_tags}
        <!--  -->

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
              />
              <link
                rel="stylesheet"
                href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/utility/utility.min.css"
              />`
          : html`<link
                rel="stylesheet"
                href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.min.css"
              />
              <link
                rel="stylesheet"
                href="${config.ASSETS_PATH}/node_modules/@gouvfr/dsfr/dist/utility/utility.min.css"
              />`}

        <!--  -->

        <link
          rel="stylesheet"
          href="${config.PUBLIC_ASSETS_PATH}/tailwind.css"
        />

        <!--  -->

        <script
          hash="sha256-ZtVO4euNrRnx0KrqoCatLuOIaHv1Z7zi++KgINh8SqM="
          nonce="${nonce}"
          type="importmap"
        >
          {
            "imports": {
              "@~/app.core/config": "${config.ASSETS_PATH}/bundle/config.js",
              "lit": "${config.PUBLIC_ASSETS_PATH}/node_modules/lit/index.js",
              "lit/": "${config.PUBLIC_ASSETS_PATH}/node_modules/lit/"
            }
          }
        </script>

        <title>
          H${Array.from({ length: Math.max(3, nonce.length) })
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
            href="https://github.com/numerique-gouv/hyyypertool/tree/${config.VERSION}"
            rel="noopener noreferrer"
            target="_blank"
            safe
          >
            <small>version ${config.VERSION}</small>
          </a>
        </footer>
      </body>

      <!--  -->

      <script
        nonce="${nonce}"
        src="${config.PUBLIC_ASSETS_PATH}/app/layout/src/_client/nprogress.js"
        type="module"
      ></script>

      <link
        rel="stylesheet"
        href="${config.ASSETS_PATH}/node_modules/nprogress/nprogress.css"
      />

      <!--  -->

      ${config.NODE_ENV === "development"
        ? html`<script
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/htmx.js"
            type="module"
          ></script>`
        : html`<script
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/htmx.min.js"
            type="module"
          ></script>`}

      <meta
        name="htmx-env"
        content="${JSON.stringify({
          defaultSettleDelay: 0,
          globalViewTransitions: true,
          historyEnabled: true,
          inlineScriptNonce: nonce,
        })}"
      />

      ${config.DEPLOY_ENV === "preview"
        ? html`<script
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/ext/debug.js"
            type="module"
          ></script>`
        : ""}

      <script
        nonce="${nonce}"
        src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/ext/include-vals.js"
        type="module"
      ></script>
      <script
        nonce="${nonce}"
        src="${config.ASSETS_PATH}/node_modules/htmx.org/dist/ext/sse.js"
        type="module"
      ></script>
      <script
        nonce="${nonce}"
        src="${config.ASSETS_PATH}/node_modules/htmx.ext...chunked-transfer/dist/index.js"
        type="module"
      ></script>

      <!--  -->

      ${config.NODE_ENV === "development"
        ? html`<script
              nonce="${nonce}"
              src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/_hyperscript.js"
            ></script>

            <script
              nonce="${nonce}"
              src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/hdb.js"
            ></script>`
        : html`<script
            nonce="${nonce}"
            src="${config.ASSETS_PATH}/node_modules/hyperscript.org/dist/_hyperscript.min.js"
          ></script> `}
    </html>
  `;
}
