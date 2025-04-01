//

import { hyper_ref } from "@~/app.core/html";
import type { SimplifyDeep } from "@~/app.core/types";
import type { Moderation } from "@~/moderations.lib/entities/Moderation";
import type { IsUserExternalMemberHandler } from "@~/moderations.lib/usecase/IsUserExternalMember";
import type { Organization } from "@~/organizations.lib/entities/Organization";
import type { SuggestOrganizationDomainsHandler } from "@~/organizations.lib/usecase";
import type { User } from "@~/users.lib/entities/User";
import type { SuggestSameUserEmailsHandler } from "@~/users.lib/usecase/SuggestSameUserEmails";
import { createContext } from "hono/jsx";

export interface Values {
  domain: string;
  moderation: SimplifyDeep<
    Pick<Moderation, "id" | "moderated_at" | "type"> & {
      organization: Pick<
        Organization,
        "cached_libelle" | "id" | "siret" | "cached_libelle_categorie_juridique"
      >;
      user: Pick<User, "email" | "id" | "family_name" | "given_name">;
    }
  >;
  $reject: string;
  $accept: string;
  $decision_form: string;
  query_suggest_same_user_emails: SuggestSameUserEmailsHandler;
  query_is_user_external_member: IsUserExternalMemberHandler;
  query_suggest_organization_domains: SuggestOrganizationDomainsHandler;
}
export const context = createContext<Values>(null as any);

//
export const reject_context = createContext({
  $destination: hyper_ref(),
  $message: hyper_ref(),
  $object: hyper_ref(),
  $modal_message: hyper_ref(),
});
export const valid_context = createContext({
  $add_as_external_member: hyper_ref(),
  $add_as_internal_member: hyper_ref(),
  $add_domain: hyper_ref(),
  $send_notification: hyper_ref(),
  is_already_internal_member: false,
  is_already_external_member: false,
});
