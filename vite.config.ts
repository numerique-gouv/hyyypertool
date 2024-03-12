//

import honox from "honox/vite";
import { defineConfig } from "vite";
import ViteRestart from "vite-plugin-restart";
import tsconfigPaths from "vite-tsconfig-paths";

import { viteStaticCopy } from "vite-plugin-static-copy";

import dotenv from "dotenv";
dotenv.config({ debug: true, path: [`.env.local`, ".env"], override: true });

//
// console.debug(Object.entries(process.env).sort());
export default defineConfig(() => ({
  css: {
    transformer: "lightningcss" as const,
    lightningcss: {},
  },

  build: {
    manifest: true,
    rollupOptions: {
      input: {
        "dsfr.module.min.css": "/packages/dsfr/src/index.module.css",
        "style.min.css": "static/style.css",
        "htmx_party.min.js": "static/htmx_party.ts",
      },
    },
  },

  plugins: [
    honox({
      entry: "app/server.ts",
      devServer: {
        // exclude: ["!**/node_modules/@~/**"],
        // ignoreWatching: ["!**/node_modules/@~/**"],
      },
    }),
    tsconfigPaths(),
    ViteRestart({
      restart: [
        "./packages/~/app/*/src/**/*.ts[x]",
        "./packages/~/welcome/api/src/**/*.ts[x]",
      ],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@gouvfr/dsfr/dist/fonts",
          dest: "assets/fonts",
        },
      ],
    }),
  ],
  // resolve: {
  //   alias: {
  //     "@~/app.api": fileURLToPath(
  //       new URL("./packages/~/app/api", import.meta.url),
  //     ),
  //   },
  // },
  // resolve: {
  //   preserveSymlinks: true, // this is the fix!
  // },
  // optimizeDeps: {
  //   // entries: [
  //   //   "/home/x/zzz/github/betagouv/hyyypertool/packages/~/app/api/src/index.ts",
  //   // ],
  //   include: ["packages/~/**/*.ts"],
  // },
  // server: {
  //   watch: {
  //     // ignored: ["**/.git/**", "!**/node_modules/@~/**"],
  //     // ignored: ["**/node_modules/.vite/**", "!**/node_modules/**"],
  //     // ignored: ["!**/node_modules/@~/**"],
  //   },
  // },

  // optimizeDeps: { force: false },
  // optimizeDeps: {
  //   exclude: ["@~/app.api"],
  // },
}));
