//

import { ErrorBoundary } from "hono/jsx";
import { Suspense } from "hono/jsx/streaming";
import { PageContext_01, _01 } from "./01";
import { ModerationPage } from "./moderations/page";

//

export function LegacyPage({ active_id }: { active_id: number | undefined }) {
  return (
    <>
      <PageContext_01.Provider
        value={{
          active_id: active_id ?? NaN,
          page: 0,
          take: 5,
          search: { email: "", siret: "", show_archived: false },
        }}
      >
        <_01 />
      </PageContext_01.Provider>
      <section id="moderation">
        <ErrorBoundary
          fallback={<>Quesque chose à mal tourné...</>}
          onError={(error) => console.error(error)}
        >
          <Suspense fallback={<>Chargement...</>}>
            <ModerationPage active_id={active_id} />
          </Suspense>
        </ErrorBoundary>
      </section>
    </>
  );
}
