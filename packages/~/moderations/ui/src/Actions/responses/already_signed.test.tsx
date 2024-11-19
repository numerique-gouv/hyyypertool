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
            organization: {
              cached_libelle: "🦄",
              id: 1,
              siret: "🦄 siret",
              cached_libelle_categorie_juridique: "🍄",
            },
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
