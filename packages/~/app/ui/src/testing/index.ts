//

import type { Child } from "hono/jsx";
import { renderToReadableStream } from "hono/jsx/dom/server";
import { format } from "prettier";

//

export async function renderHTML(element: Child) {
  const textDecoder = new TextDecoder();
  const getStringFromStream = async (
    stream: ReadableStream<Uint8Array>,
  ): Promise<string> => {
    const reader = stream.getReader();
    let str = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      str += textDecoder.decode(value);
    }
    return str;
  };
  return format(
    await getStringFromStream(await renderToReadableStream(element)),
    { parser: "html" },
  );
}
