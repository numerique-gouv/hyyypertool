//

import * as accountant from "./accountant";
import * as admin_centrale from "./admin_centrale";
import * as already_signed from "./already_signed";
import * as chorus_pro_error from "./chorus_pro_error";
import * as contractors from "./contractors";
import * as deprecated_conseiller_numerique_email from "./deprecated_conseiller_numerique_email";
import * as enseignement_agricole from "./enseignement_agricole";
import * as first_and_last_name_inversion from "./first_and_last_name_inversion";
import * as first_last_name from "./first_last_name";
import * as gendarmerie_agent from "./gendarmerie_agent";
import * as invalid_job from "./invalid_job";
import * as invalid_name_job from "./invalid_name_job";
import * as link_with_chosen_organization from "./link_with_chosen_organization";
import * as link_with_eduction_gouv_fr from "./link_with_eduction_gouv_fr";
import * as link_with_organization from "./link_with_organization";
import * as min_armees from "./min_armees";
import * as min_armees_pec from "./min_armees_pec";
import * as min_armees_terre_marine_musee from "./min_armees_terre_marine_musee";
import * as missing_name from "./missing_name";
import * as mobilic from "./mobilic";
import * as name_incorrectly_entered from "./name_incorrectly_entered";
import * as non_teaching_agent from "./non_teaching_agent";
import * as occupation_incorrectly_entered from "./occupation_incorrectly_entered";
import * as occupation_incorrectly_entered_not_blocking from "./occupation_incorrectly_entered_not_blocking";
import * as public_or_private_organization from "./public_or_private_organization";
import * as refusal_france_travail from "./refusal_france_travail";
import * as teacher_academic_email from "./teacher_academic_email";
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
  deprecated_conseiller_numerique_email,
  enseignement_agricole,
  missing_name,
  first_and_last_name_inversion,
  name_incorrectly_entered,
  occupation_incorrectly_entered_not_blocking,
  occupation_incorrectly_entered,
  min_armees,
  admin_centrale,
  teacher_academic_email,
  link_with_chosen_organization,
  public_or_private_organization,
  min_armees_pec,
  non_teaching_agent,
  refusal_france_travail,
  min_armees_terre_marine_musee,
  gendarmerie_agent,
];
