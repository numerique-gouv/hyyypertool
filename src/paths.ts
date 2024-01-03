//

import { path, type Params } from "static-path";

//

type KnownPath =
  | "/"
  | "/auth/login"
  | "/auth/login/callback"
  | "/auth/logout"
  | "/legacy"
  | "/legacy/duplicate_warning"
  | "/legacy/leaders"
  | "/legacy/moderations"
  | "/legacy/moderations/:id"
  | "/legacy/organizations"
  | "/legacy/organizations/:id/domains/external"
  | "/legacy/organizations/:id/domains/external/:domain"
  | "/legacy/organizations/:id/domains/internal"
  | "/legacy/organizations/:id/domains/internal/:domain"
  | "/legacy/organizations/:id/members"
  | "/legacy/users"
  | "/legacy/users/:id"
  | "/legacy/users/:id/organizations";

//

export function api_ref<TPathname extends KnownPath>(
  pathname: TPathname,
  params: Params<TPathname>,
) {
  return path(pathname)(params);
}
