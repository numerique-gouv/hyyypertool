//

import { PageContext_01, _01 } from "./01";
import { ModerationPage } from "./moderations/page";

export function LegacyPage({ active_id }: { active_id: number | undefined }) {
  return (
    <>
      <PageContext_01.Provider
        value={{
          active_id: active_id ?? NaN,
          page: 0,
          take: 5,
          search: { email: "", siret: "" },
        }}
      >
        <_01 />
      </PageContext_01.Provider>
      <ModerationPage active_id={active_id} />
    </>
  );
}
