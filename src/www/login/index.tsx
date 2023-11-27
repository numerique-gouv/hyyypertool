//

import env from ":env";
import { Hono } from "hono";

//

export default new Hono()
  .get("/", ({ redirect }) => redirect("/"))
  .post("/", ({ html, text, req }) => {
    if (env.DEPLOY_ENV === "preview") {
      return text("", 200, {
        "HX-Redirect": "/legacy",
      });
    }

    return html(<>Not Implemented</>, 404);
  });
