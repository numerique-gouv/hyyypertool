//

import { path, type Params } from "static-path";

//

type KnownPath = "/" | "/legacy/moderations/:id";

//

export function api_ref<TPathname extends KnownPath>(
  pathname: TPathname,
  params: Params<TPathname>,
) {
  return path(pathname)(params);
}
