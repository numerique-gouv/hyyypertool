import { tag } from "@~/app.ui/tag";
import {
  Verification_Type_Schema,
  type Verification_Type,
} from "@~/moncomptepro.lib/verification_type";

const verificationType: Array<[Verification_Type, string]> = [
  [
    Verification_Type_Schema.enum.in_liste_dirigeants_rna,
    "Liste des dirigeants",
  ],
  [Verification_Type_Schema.enum.official_contact_email, "Mail officiel"],
  [
    Verification_Type_Schema.enum.no_validation_means_available,
    "No validation means available",
  ],
  // [Verification_Type_Schema.enum.verified_email_domain, "Domaine email"],
  // [
  //   Verification_Type_Schema.enum.verified_by_coop_mediation_numerique,
  //   "Verified by coop mediation numerique",
  // ],

  // "Justificatif transmis",
  // "No validation means available",
  // "Verified by coop mediation numerique",
];

export function TagInput() {
  return (
    <ul class="fr-tags-group">
      {verificationType.map(([value, key]) => (
        <li key={key}>
          <label class={tag()}>
            <input
              hidden
              class="m-1"
              type="radio"
              value={value ?? "null"}
              name="verification_type"
              checked={
                value ===
                Verification_Type_Schema.enum.no_validation_means_available
              }
            />
            {key}
          </label>
        </li>
      ))}
    </ul>
  );
}
