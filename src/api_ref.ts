//

import { path, type Params } from "static-path";

//

type KnownPath =
  | "/"
  | "/auth/login"
  | "/auth/login/callback"
  | "/auth/logout"
  | "/legacy/duplicate_warning"
  | "/legacy/leaders"
  | "/legacy/moderations/:id"
  | "/legacy/organizations/:id/domains/external"
  | "/legacy/organizations/:id/domains/external/:domain"
  | "/legacy/organizations/:id/domains/internal"
  | "/legacy/organizations/:id/domains/internal/:domain"
  | "/legacy/users"
  | "/legacy/users/:id"
  | "/legacy/users/:id/organizations"
  | "/legacy/users/:id/reset"
  | "/moderations";

//

export function api_ref<TPathname extends KnownPath>(
  pathname: TPathname,
  params: Params<TPathname>,
) {
  return path(pathname)(params);
}
