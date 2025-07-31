//

import config from "@~/app.core/config";

//

export function SimpleToasterContainer({ nonce }: { nonce?: string } = {}) {
  return (
    <script
      nonce={nonce}
      src={`${config.PUBLIC_ASSETS_PATH}/app/ui/src/toast/_client/toast.js`}
      type="module"
    />
  );
}