//

import { Hono } from "hono";

//

export const proxy = new Hono().get(
  "/proxy/localhost:3000/*",
  ({ req, redirect }) => {
    const uri = new URL(
      req.url.replace("/proxy/localhost:3000", ""),
      "http://localhost:3000/",
    );
    uri.hostname = "localhost";
    uri.port = "3000";
    return redirect(uri.toString());
  },
);
