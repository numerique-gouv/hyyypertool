//

import { About } from "@~/organizations.ui/info/About";
import { Investigation } from "@~/organizations.ui/info/Investigation";
import { usePageRequestContext } from "./context";

//

export async function Fiche() {
  const {
    var: { organization, organization_fiche },
  } = usePageRequestContext();

  return (
    <section class="grid grid-cols-3 gap-4">
      <div class="fr-card col-span-2 p-6!">
        <h1 class="text-(--text-action-high-blue-france)">
          « {organization.cached_libelle} »
        </h1>
        <About organization={organization_fiche} />
      </div>
      <div class="fr-card p-6!">
        <Investigation organization={organization} />
      </div>
    </section>
  );
}
