//

import { Hono } from "hono";

//

export default new Hono().get("/", ({ html }) =>
  html(
    <html>
      <head></head>
      <body>From sdfssdfsdf ???</body>
    </html>,
  ),
);
