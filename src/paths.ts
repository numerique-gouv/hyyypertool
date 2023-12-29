//

import { path, type Params } from "static-path";

//

type KnownPath =
  | "/"
  | "/legacy"
  | "/legacy/duplicate_warning"
  | "/legacy/leaders"
  | "/legacy/moderations"
  | "/legacy/moderations/:id"
  | "/legacy/organizations/:id/domains/external"
  | "/legacy/organizations/:id/domains/external/:domain"
  | "/legacy/organizations/:id/domains/internal"
  | "/legacy/organizations/:id/domains/internal/:domain"
  | "/legacy/organizations/:id/members"
  | "/legacy/users/:id/organizations";

//

export function api_ref<TPathname extends KnownPath>(
  pathname: TPathname,
  params: Params<TPathname>,
) {
  return path(pathname)(params);
}
