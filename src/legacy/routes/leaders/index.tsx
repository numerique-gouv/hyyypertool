//

import env from ":common/env";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import lodash_sortby from "lodash.sortby";
import { z } from "zod";

//

export default new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      siret: z.string(),
    }),
  ),
  async function ({ html, req }) {
    const { siret } = req.valid("query");
    return html(<List_Leaders siret={siret} />);
  },
);

//

async function List_Leaders({ siret }: { siret: string }) {
  const doc = await load_leaders({ siret });
  if (!doc) return <>Pas de liste des dirigeants</>;
  return <a href={doc.url}>Liste des dirigeants</a>;
}

async function load_leaders({ siret }: { siret: string }) {
  const siren = siret.substring(0, 9);
  const query_params = new URLSearchParams({
    context: "Modération MonComptePro",
    object: "Modération MonComptePro",
    recipient: "13002526500013",
  });
  const response = await fetch(
    `https://entreprise.api.gouv.fr/v4/djepva/api-association/associations/${siren}?${query_params}`,
    {
      headers: {
        Authorization: `Bearer ${env.ENTREPRISE_API_GOUV_TOKEN}`,
      },
    },
  );
  const { data } =
    (await response.json()) as Entreprise_API_Association_Response;
  if (!data) return;

  const docs = data.documents_rna;
  const sortedDocs = lodash_sortby(docs, ["annee_depot", "date_depot"]);
  const doc = sortedDocs.findLast(({ sous_type: { code } }) => code === "LDC");

  return doc;
}
//

interface Entreprise_API_Association_Response {
  data: {
    documents_rna: {
      annee_depot: string;
      date_depot: string;
      sous_type: {
        code: string;
      };
      url: string;
    }[];
  };
}
