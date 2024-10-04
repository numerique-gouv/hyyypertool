//

import { renderHTML } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { Header } from "./Header";

test("render header section", async () => {
  expect(
    await renderHTML(
      <Header.Provier
        value={{
          moderation: {
            comment: null,
            moderated_at: null,
            moderated_by: null,
            id: 42,
            organization: { cached_libelle: "🦄 libelle", id: 43 },
            type: "organization_join_block",
            user: {
              email: "adora.pony@unicorn.xyz",
              family_name: "Pony",
              given_name: "Adora",
              id: 44,
            },
          },
        }}
      >
        <Header />
      </Header.Provier>,
    ),
  ).toMatchSnapshot();
});
