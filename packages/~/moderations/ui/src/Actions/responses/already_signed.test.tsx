//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context } from "../context";
import already_signed from "./already_signed";

//

test("returns all members", async () => {
  expect(
    await render_md(
      <context.Provider
        value={{
          $reject: "",
          $accept: "",
          $decision_form: "",
          domain: "unicorn.xyz",
          moderation: {
            organization: { cached_libelle: "🦄", id: 1, siret: "🦄 siret" },
            user: { id: 42, given_name: "", email: "", family_name: "🧟" },
            id: 1,
            moderated_at: "2011-11-11",
            type: "non_verified_domain",
          },
          query_suggest_same_user_emails: async () => [
            "🦄@unicorn.xyz",
            "🐷@unicorn.xyz",
            "🧧@unicorn.xyz",
          ],
          query_is_user_external_member: async () => false,
        }}
      >
        <AlreadySigned />
      </context.Provider>,
    ),
  ).toMatchSnapshot();
});

function AlreadySigned() {
  return <>{already_signed()}</>;
}

// import { set_moncomptepro_pg } from "@~/app.middleware/set_moncomptepro_pg";
// import {
//   create_adora_pony_user,
//   create_pink_diamond_user,
//   create_red_diamond_user,
//   create_unicorn_organization,
// } from "@~/moncomptepro.database/seed/unicorn";
// import {
//   add_user_to_organization,
//   empty_database,
//   migrate,
//   pg,
// } from "@~/moncomptepro.database/testing";
// import { beforeAll, beforeEach, expect, test } from "bun:test";
// import { Hono } from "hono";
// import { jsxRenderer } from "hono/jsx-renderer";
// // import {
// //   type ContextType,
// //   type get_moderation_dto,
// //   type get_organization_member_dto,
// // } from "../context";
// import already_signed from "./already_signed";

// //

// // beforeAll(migrate);
// // beforeEach(empty_database);


// // test("returns Diamond members", async () => {
// //   const unicorn_organization_id = await given_unicorn_organization();

// //   const app = new Hono<ContextType>()
// //     .use("*", jsxRenderer())
// //     .use("*", set_moncomptepro_pg(pg))
// //     .get(
// //       "/already_signed",
// //       ({ set }, next) => {
// //         set("domain", "unicorn.xyz");
// //         set("moderation", {
// //           organization: { cached_libelle: "🦄", id: unicorn_organization_id },
// //           user: { family_name: "Diamond" },
// //         } as get_moderation_dto);
// //         set("organization_member", {} as get_organization_member_dto);
// //         return next();
// //       },
// //       ({ render }) => {
// //         return render(<AlreadySigned />);
// //       },
// //     );

// //   const res = await app.fetch(
// //     new Request("http://localhost:3000/already_signed"),
// //   );
// //   expect(res.status).toBe(200);
// //   expect(await res.text()).toMatchSnapshot();
// // });

// // async function given_unicorn_organization() {
// //   const unicorn_organization_id = await create_unicorn_organization(pg);
// //   const adora_pony_user_id = await create_adora_pony_user(pg);
// //   await add_user_to_organization({
// //     organization_id: unicorn_organization_id,
// //     user_id: adora_pony_user_id,
// //   });
// //   const pink_diamond_user_id = await create_pink_diamond_user(pg);
// //   await add_user_to_organization({
// //     organization_id: unicorn_organization_id,
// //     user_id: pink_diamond_user_id,
// //   });
// //   const red_diamond_user_id = await create_red_diamond_user(pg);
// //   await add_user_to_organization({
// //     organization_id: unicorn_organization_id,
// //     user_id: red_diamond_user_id,
// //   });
// //   return unicorn_organization_id;
// // }

// // async function AlreadySigned() {
// //   return <>{await already_signed()}</>;
// // }
