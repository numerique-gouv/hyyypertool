//

import env from ":env";
import type { PropsWithChildren } from "@kitajs/html";

//

export function Root_Layout({ children }: PropsWithChildren) {
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
          href="/public/@gouvfr/dsfr/dist/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          href="/public/@gouvfr/dsfr/dist/favicon/favicon.svg"
          type="image/svg+xml"
        />
        <link
          rel="shortcut icon"
          href="/public/@gouvfr/dsfr/dist/favicon/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="manifest"
          href="/public/@gouvfr/dsfr/dist/favicon/manifest.webmanifest"
          crossorigin="use-credentials"
        />

        <link rel="stylesheet" href="/public/tailwind/styles.css" />

        <link rel="stylesheet" href="/public/animate.css/source/_vars.css" />
        <link rel="stylesheet" href="/public/animate.css/source/_base.css" />
        <link
          rel="stylesheet"
          href="/public/animate.css/source/zooming_entrances/zoomInDown.css"
        />
        <link
          rel="stylesheet"
          href="/public/animate.css/source/attention_seekers/flash.css"
        />
        <link
          rel="stylesheet"
          href="/public/animate.css/source/fading_entrances/fadeInLeftBig.css"
        />
        <link rel="stylesheet" href="/public/@gouvfr/dsfr/dist/dsfr.css" />

        <script type="importmap">
          {JSON.stringify({
            imports: {
              "public/client/hyyypertitle.js": "/public/client/hyyypertitle.js",
              lit: "/public/lit",
              "lit/": "/public/lit/",
            },
          })}
        </script>
        <script type="module" src="/public/htmx.org/dist/htmx.js" />
        <title>
          H{Array.from({ length: Math.max(3, Math.random() * 5) }).fill("y")}
          pertool
        </title>

        <meta
          name="htmx-config"
          content='{"historyEnabled":false,"defaultSettleDelay":0}'
        />
      </head>
      <body class="flex min-h-screen flex-col">
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
