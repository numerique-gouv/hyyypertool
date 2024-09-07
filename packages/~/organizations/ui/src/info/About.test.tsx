//

import { expect, test } from "bun:test";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { format } from "prettier";
import { About } from "./About";

test("render about section", async () => {
  const response = await new Hono()
    .get("/", jsxRenderer(), ({ render }) =>
      render(
        <About
          organization={{
            cached_activite_principale: "",
            cached_adresse: "",
            cached_code_postal: "",
            cached_est_active: true,
            cached_etat_administratif: "",
            cached_libelle_categorie_juridique: "",
            cached_libelle_tranche_effectif: "",
            cached_libelle: "",
            cached_nom_complet: "",
            cached_tranche_effectifs: "",
            created_at: "",
            id: 42,
            siret: "",
            updated_at: "",
          }}
        />,
      ),
    )
    .request("/");
  expect(response.status).toBe(200);
  expect(
    await format(await response.text(), { parser: "html" }),
  ).toMatchSnapshot();
});
