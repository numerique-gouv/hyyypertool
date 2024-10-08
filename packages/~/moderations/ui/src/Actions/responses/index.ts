//

import * as accountant from "./accountant";
import * as already_signed from "./already_signed";
import * as chorus_pro_error from "./chorus_pro_error";
import * as contractors from "./contractors";
import * as first_last_name from "./first_last_name";
import * as invalid_job from "./invalid_job";
import * as invalid_name_job from "./invalid_name_job";
import * as link_with_eduction_gouv_fr from "./link_with_eduction_gouv_fr";
import * as link_with_organization from "./link_with_organization";
import * as mobilic from "./mobilic";
import * as use_official_email from "./use_official_email";
import * as use_pro_email from "./use_pro_email";

//

export const reponse_templates = [
  first_last_name,
  link_with_organization,
  use_pro_email,
  use_official_email,
  already_signed,
  link_with_eduction_gouv_fr,
  mobilic,
  contractors,
  accountant,
  invalid_name_job,
  chorus_pro_error,
  invalid_job,
];
