//

import { UserInfo_Context } from ":auth/userinfo.context";
import { Root_Provider } from ":common/root.provider";
import { ErrorBoundary, useContext } from "hono/jsx";
import { Suspense } from "hono/jsx/streaming";
import { PageContext_01, PageContext_01_default, _01 } from "./moderations/01";
import { ModerationPage } from "./moderations/page";

//

export function LegacyPage({
  active_id,
  page,
}: {
  active_id: number | undefined;
  page: number | undefined;
}) {
  const userinfo = useContext(UserInfo_Context);

  return (
    <>
      <PageContext_01.Provider
        value={{
          ...PageContext_01_default,
          active_id: active_id ?? NaN,
          page: page ?? 0,
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
            <Root_Provider userinfo={userinfo}>
              <ModerationPage active_id={active_id} />
            </Root_Provider>
          </Suspense>
        </ErrorBoundary>
      </section>
    </>
  );
}
