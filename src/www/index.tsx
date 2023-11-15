//

import type { ElysiaWWW } from ":www";

export default (www: ElysiaWWW) =>
  www.get("/", () => (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          H{Array.from({ length: Math.random() * 5 }).fill("y")}pertool
        </title>
        <link rel="stylesheet" href="/public/tailwind/styles.css"></link>
      </head>
      <h1>Hello Raaoph</h1>
    </html>
  ));
