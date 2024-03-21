//

import { hyper_ref } from "@~/app.core/html";
import { urls } from "@~/app.urls";
import type { InferRequestType } from "hono";
import { createContext } from "hono/jsx";

//
export const Desicison_Context = createContext({
  $accept: hyper_ref(),
  $add_as_external_member: hyper_ref(),
  $add_as_internal_member: hyper_ref(),
  $add_domain: hyper_ref(),
  $destination: hyper_ref(),
  $do_not_add_member: hyper_ref(),
  $form: hyper_ref(),
  $message: hyper_ref(),
  $object: hyper_ref(),
  $reject: hyper_ref(),
  $select: hyper_ref(),
});

//

const validation_mutation = urls.moderations[":id"].$procedures.validate.$patch;
export type Validation_MutationInputKeys = keyof InferRequestType<
  typeof validation_mutation
>["form"];
