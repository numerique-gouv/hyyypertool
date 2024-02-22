//

import { z } from "zod";

export type Htmx_Header = {
  "HX-Refresh"?: "true" | "false";
  "HX-Location"?: string;
  "HX-Trigger"?: string;
};

// \from https://htmx.org/reference/#events
export const Htmx_Events = z.enum([
  "htmx:abort", //	send this event to an element to abort a request
  "htmx:afterOnLoad", //	triggered after an AJAX request has completed processing a successful response
  "htmx:afterProcessNode", //	triggered after htmx has initialized a node
  "htmx:afterRequest", //	triggered after an AJAX request has completed
  "htmx:afterSettle", //	triggered after the DOM has settled
  "htmx:afterSwap", //	triggered after new content has been swapped in
  "htmx:beforeCleanupElement", //	triggered before htmx disables an element or removes it from the DOM
  "htmx:beforeHistorySave", //	triggered before content is saved to the history cache
  "htmx:beforeOnLoad", //	triggered before any response processing occurs
  "htmx:beforeProcessNode", //	triggered before htmx initializes a node
  "htmx:beforeRequest", //	triggered before an AJAX request is made
  "htmx:beforeSend", //	triggered just before an ajax request is sent
  "htmx:beforeSwap", //	triggered before a swap is done, allows you to configure the swap
  "htmx:configRequest", //	triggered before the request, allows you to customize parameters, headers
  "htmx:confirm", //	triggered after a trigger occurs on an element, allows you to cancel (or delay) issuing the AJAX request
  "htmx:historyCacheError", //	triggered on an error during cache writing
  "htmx:historyCacheMiss", //	triggered on a cache miss in the history subsystem
  "htmx:historyCacheMissError", //	triggered on a unsuccessful remote retrieval
  "htmx:historyCacheMissLoad", //	triggered on a successful remote retrieval
  "htmx:historyRestore", //	triggered when htmx handles a history restoration action
  "htmx:load", //	triggered when new content is added to the DOM
  "htmx:noSSESourceError", //	triggered when an element refers to a SSE event in its trigger, but no parent SSE source has been defined
  "htmx:onLoadError", //	triggered when an exception occurs during the onLoad handling in htmx
  "htmx:oobAfterSwap", //	triggered after an out of band element as been swapped in
  "htmx:oobBeforeSwap", //	triggered before an out of band element swap is done, allows you to configure the swap
  "htmx:oobErrorNoTarget", //	triggered when an out of band element does not have a matching ID in the current DOM
  "htmx:prompt", //	triggered after a prompt is shown
  "htmx:pushedIntoHistory", //	triggered after an url is pushed into history
  "htmx:responseError", //	triggered when an HTTP response error (non-200 or 300 response code) occurs
  "htmx:sendError", //	triggered when a network error prevents an HTTP request from happening
  "htmx:sseError", //	triggered when an error occurs with a SSE source
  "htmx:sseOpen", //	triggered when a SSE source is opened
  "htmx:swapError", //	triggered when an error occurs during the swap phase
  "htmx:targetError", //	triggered when an invalid target is specified
  "htmx:timeout", //	triggered when a request timeout occurs
  "htmx:validation:failed", //	triggered when an element fails validation
  "htmx:validation:halted", //	triggered when a request is halted due to validation errors
  "htmx:validation:validate", //	triggered before an element is validated
  "htmx:xhr:abort", //	triggered when an ajax request aborts
  "htmx:xhr:loadend", //	triggered when an ajax request ends
  "htmx:xhr:loadstart", //	triggered when an ajax request starts
  "htmx:xhr:progress", //	triggered periodically during an ajax request that supports progress events
]);

export function hx_trigger_from_body(events: string[]) {
  return events.map((event) => `${event} from:body`);
}
export function hx_include(ids: string[]) {
  return ids.map(prefix_id).join(", ");
}
export function prefix_id(name: string) {
  return `#${name}`;
}

export function is_htmx_request(req: Request) {
  return req.headers.get("hx-request") === "true";
}
