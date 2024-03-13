import type { Moderation_Type } from "@~/moderations.lib/Moderation_Type";
import { useContext } from "hono/jsx";
import { match } from "ts-pattern";
import { ModerationPage_Context } from "./context";

export function MessageInfo() {
  const { moderation } = useContext(ModerationPage_Context);
  return (
    <p>
      <b>
        {moderation.users.given_name} {moderation.users.family_name}
      </b>{" "}
      <span class="text-gray-600">
        {match(moderation.type as Moderation_Type)
          .with("ask_for_sponsorship", () => "demande un sponsorship")
          .with(
            "big_organization_join",
            () => "a rejoint l'organisation de plus de 50 employés",
          )
          .with(
            "non_verified_domain",
            () => "a rejoint une organisation avec un domain non vérifié  ",
          )
          .with(
            "organization_join_block",
            () => "veut rejoindre l'organisation",
          )
          .otherwise(
            (type) => `veut effectuer une action inconnue (type ${type})`,
          )}
      </span>{" "}
      « <b>{moderation.organizations.cached_libelle}</b> »{" "}
      <span class="text-gray-600">avec l’adresse</span>{" "}
      <b>{moderation.users.email}</b>
    </p>
  );
}
