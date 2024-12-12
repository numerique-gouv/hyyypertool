//

import { zValidator } from "@hono/zod-validator";
import { HTTPError } from "@~/app.core/error";
import type { App_Context } from "@~/app.middleware/context";
import { CoopAccount_Schema } from "@~/import.lib/entities";
import { ImportCoopAccount } from "@~/import.lib/usecase";
import { Hono } from "hono";
import { match, P } from "ts-pattern";
import { z, ZodError } from "zod";
import { coop_authorized } from "./coop.auth";

//

export const Input_Schema = z.object({
  prenom: z.string(),
  nom: z.string(),
  téléphone: z.string(),
  email: z.string(),
  coordinateur: z
    .string()
    .transform((value) =>
      value === "oui"
        ? "Coordinateur conseillers numérique"
        : "Conseiller numérique",
    ),
  "Code Postal": z.string(),
  "Nom commune": z.string(),
  "SIRET structure": z.string(),
  "email professionnel secondaire": z.string(),
});

export default new Hono<App_Context>()
  .post(
    "/coop",
    coop_authorized(),
    zValidator(
      "json",
      Input_Schema.transform((input) => ({
        coordinator: input.coordinateur,
        email: input.email,
        family_name: input.nom,
        given_name: input.prenom,
        phone_number: input.téléphone,
        professional_email: input["email professionnel secondaire"],
        siret: input["SIRET structure"],
      })).pipe(CoopAccount_Schema),
    ),
    async function POST({ json, req, var: { moncomptepro_pg } }) {
      const coop_account = req.valid("json");
      const import_coop_acount = ImportCoopAccount({
        pg: moncomptepro_pg,
      });
      const summary = await import_coop_acount(coop_account);
      return json(summary);
    },
  )
  .onError((err, { notFound }) => {
    return match(err)
      .with(P.instanceOf(ZodError), () => {
        console.log("ZodError", err);
        return notFound();
      })
      .otherwise(() => {
        throw new HTTPError("Invalid Zammad attachment", { cause: err });
      });
  });
