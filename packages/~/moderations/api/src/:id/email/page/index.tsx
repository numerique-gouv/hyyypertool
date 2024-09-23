//

import { match, P } from "ts-pattern";
import { usePageRequestContext } from "./context";
import Crisp from "./Crisp";
import { FindCorrespondingEmail } from "./FindCorrespondingEmail";
import Zammad from "./Zammad";

//

export default async function Page() {
  const {
    var: { crisp, zammad },
  } = usePageRequestContext();
  return match({ crisp, zammad })
    .with({ crisp: P.nonNullable }, () => <Crisp />)
    .with({ zammad: P.nonNullable }, () => <Zammad />)
    .otherwise(() => <FindCorrespondingEmail />);
}
