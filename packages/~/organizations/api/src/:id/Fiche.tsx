//

import { About } from "@~/organizations.ui/info/About";
import { Investigation } from "@~/organizations.ui/info/Investigation";
import { usePageRequestContext } from "./context";

//

export async function Fiche() {
  const {
    var: { organization },
  } = usePageRequestContext();

  return (
    <section class="grid grid-cols-2 gap-5">
      <About organization={organization} />
      <Investigation organization={organization} />
    </section>
  );
}
