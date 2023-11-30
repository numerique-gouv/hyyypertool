//

import env from ":env";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";

//

const callback = "/callback";
export default new Hono()
  .get("/", ({ redirect }) => redirect("/"))
  .get(callback, function (c) {
    const { redirect } = c;
    setCookie(c, "AgentConnect", "userinfo");
    setCookie(c, "AgentConnect", "idtoken");
    setCookie(c, "AgentConnect", "oauth2token");

    return redirect("/");
  })
  .post("/", ({ html, text, req }) => {
    if (env.DEPLOY_ENV === "preview") {
      return text("", 200, {
        "HX-Redirect": "/legacy",
      });
    }

    return html(<>Not Implemented</>, 404);
  });
