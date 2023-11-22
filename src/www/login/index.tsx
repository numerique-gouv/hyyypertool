//

import ENV from ":env";
import type { ElysiaWWW } from ":www";
import { NotFoundError } from "elysia";

//

export default (www: ElysiaWWW) =>
  www
    .get("/", ({ set }) => {
      set.redirect = "/";
    })
    .post("/", ({ set }) => {
      console.log("ENV.DEPLOY_ENV", ENV.DEPLOY_ENV);
      if (ENV.DEPLOY_ENV === "preview") {
        set.headers["HX-Redirect"] = "/legacy";
        return;
      }

      throw new NotFoundError("Not Implemented");
    });
