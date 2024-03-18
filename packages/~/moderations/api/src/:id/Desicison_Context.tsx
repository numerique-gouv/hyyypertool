//

import { hyper_ref } from "@~/app.core/html";
import { createContext } from "hono/jsx";

//
export const Desicison_Context = createContext({
  $accept: hyper_ref(),
  $allow: hyper_ref(),
  $destination: hyper_ref(),
  $form: hyper_ref(),
  $message: hyper_ref(),
  $object: hyper_ref(),
  $reject: hyper_ref(),
  $select: hyper_ref(),
});
