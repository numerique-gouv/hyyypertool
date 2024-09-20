//

import { $ } from "bun";

const minify = true;

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: ["lit"],
    outdir: "./public/built",
    minify,
  });
  console.log({ logs, outputs, success });
}
{
  const lit_files = [
    "async-directive.js",
    "decorators.js",
    "directive.js",
    "directives/repeat.js",
    "html.js",
  ];
  const { logs, outputs, success } = await Bun.build({
    entrypoints: lit_files.map((entrypoint) =>
      Bun.resolveSync(`lit/${entrypoint}`, process.cwd()),
    ),
    outdir: `./public/built/node_modules/lit`,
    minify,
  });
  console.log({ logs, outputs, success });
}

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: [
      "./packages/~/app/layout/src/_client/nprogress.ts",
      "./packages/~/welcome/api/src/_client/hyyypertitle.ts",
    ],
    external: ["lit", "@~/app.core/config"],
    minify,
    outdir: "./public/built",
  });
  console.log({ logs, outputs, success });
}

{
  console.log("> @numerique-gouv/moncomptepro install");
  const { stdout } = await $`npm i`
    .cwd("node_modules/@numerique-gouv/moncomptepro")
    .env({
      ...process.env,
      CYPRESS_INSTALL_BINARY: "0",
    });
  console.log(stdout.toString());
}
{
  console.log("> @numerique-gouv/moncomptepro build");
  const { stdout } = await $`npm exec tsc`.cwd(
    "node_modules/@numerique-gouv/moncomptepro",
  );
  console.log(stdout.toString());
}

export {};
