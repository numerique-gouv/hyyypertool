//

import { version } from ":package.json";
import type { ElysiaWWW } from ":www";

export default (www: ElysiaWWW) =>
  www.get("/", () => (
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

        <link rel="stylesheet" href="/public/@gouvfr/dsfr/dist/dsfr.min.css" />

        <script type="module" src="/public/htmx.org/dist/htmx.js" />
        <script
          type="module"
          src="/public/hyperscript.org/dist/_hyperscript.js"
        />
        <title>
          H{Array.from({ length: Math.max(1, Math.random() * 5) }).fill("y")}
          pertool
        </title>
      </head>
      <body class="flex min-h-screen flex-col items-center justify-center">
        <main class="flex flex-grow flex-col items-center justify-center">
          <h1 class="fr-display--xl ">
            <span class="text-[--text-active-blue-france]">H</span>
            <span
              _="
            on load
              measure my left then
                log `My width is ${Math.floor(left  / 50)}`
                repeat Math.floor(left / 50 ) times
                  put 'y' at the end of me
                  wait (left / 50)ms
                end
            "
              class="text-[--text-active-blue-france]"
            ></span>
            <div
              _="
              on load
                hide me
                wait 1s
                show me
              "
              style="text-shadow: 0 0 4px #000;"
              class="animated fast flash inline-block text-white  "
            >
              per
            </div>
            <div class="animated slower delay-1s zoomInDown inline-block text-[--text-active-red-marianne]">
              tool
            </div>
          </h1>
        </main>
        <footer class="container my-2 flex flex-row justify-between">
          <div>© {new Date().getFullYear()} 🇫🇷 </div>
          <a
            href={`https://github.com/betagouv/hyyypertool/tree/v${version}`}
            rel="noopener noreferrer"
            target="_blank"
            safe
          >
            v{version}
          </a>
        </footer>
      </body>
    </html>
  ));
