//

import Crisp from "@~/moderations.ui/Crisp";
import { FindCorrespondingEmail } from "@~/moderations.ui/FindCorrespondingEmail";
import { match, P } from "ts-pattern";
import { usePageRequestContext } from "./context";
import Zammad from "./Zammad";

//

export default async function Page() {
  const {
    var: { moderation, crisp, zammad, crisp_config },
  } = usePageRequestContext();
  return match({ crisp, zammad })
    .with({ crisp: P.nonNullable }, (value) => (
      <Crisp.Provider value={{ crisp_config, limit: 3, crisp: value.crisp }}>
        <Crisp />
      </Crisp.Provider>
    ))
    .with({ zammad: P.nonNullable }, () => <Zammad />)
    .otherwise(() => (
      <FindCorrespondingEmail
        email={moderation.user.email}
        website_id={crisp_config.website_id}
      />
    ));
}
