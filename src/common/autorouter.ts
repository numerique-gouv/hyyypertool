//

import { Hono } from "hono";

//

export async function hono_autoroute({
  basePath,
  dir,
}: {
  basePath: string | undefined;
  dir: string;
}) {
  const autoroute = new Hono().basePath(basePath ?? "");
  const file_system_router = new Bun.FileSystemRouter({
    style: "nextjs",
    dir,
  });
  for (const [route, file_path] of Object.entries(file_system_router.routes)) {
    if (
      route
        .split("/")
        .some(
          (partial_path) =>
            partial_path.startsWith("_") || partial_path.startsWith("."),
        )
    )
      continue;

    const module = (await import(file_path)) as { default: Hono };
    autoroute.route(route, module.default);
  }

  return autoroute;
}
