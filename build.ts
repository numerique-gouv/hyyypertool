//

const minify = true;

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: ["lit"],
    outdir: "./public/assets",
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
    outdir: `./public/assets/node_modules/lit`,
    minify,
  });
  console.log({ logs, outputs, success });
}

{
  const { logs, outputs, success } = await Bun.build({
    entrypoints: ["./packages/~/welcome/api/src/_client/hyyypertitle.ts"],
    external: ["lit", "@~/app.core/config"],
    minify,
    outdir: "./public/assets",
  });
  console.log({ logs, outputs, success });
}

export { };
