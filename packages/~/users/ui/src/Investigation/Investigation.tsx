//

import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { button } from "@~/app.ui/button";
import { GoogleSearchButton } from "@~/app.ui/button/components/search";
import type { Organization } from "@~/organizations.lib/entities/Organization";
import type { User } from "@~/users.lib/entities/User";

//

type InvestigationProps = {
  user: Pick<User, "email">;
  organization: Pick<Organization, "cached_libelle">;
};

//

export function Investigation(props: InvestigationProps) {
  const { user, organization } = props;

  const domain = z_email_domain.parse(user.email, { path: ["user.email"] });

  return (
    <section {...props}>
      <h4>🕵️ Enquête sur ce profile</h4>

      <ul class="list-none pl-0">
        <li>
          <GoogleSearchButton
            class={button({ size: "sm", type: "tertiary" })}
            query={user.email}
          >
            Résultats Google pour cet email
          </GoogleSearchButton>
        </li>
        <li>
          <GoogleSearchButton
            class={button({ size: "sm", type: "tertiary" })}
            query={domain}
          >
            Résultats Google pour ce nom de domaine
          </GoogleSearchButton>
        </li>
        <li>
          <GoogleSearchButton
            class={button({ size: "sm", type: "tertiary" })}
            query={`${organization.cached_libelle} ${domain}`}
          >
            Résultats Google pour le nom de l'organisation et le nom de domaine
          </GoogleSearchButton>
        </li>
      </ul>
    </section>
  );
}
