//

import type { HonoRequest, Schema } from "hono";
import { hc } from "hono/client";
import type { HonoBase } from "hono/hono-base";
import type { HasRequiredKeys, UnionToIntersection } from "hono/utils/types";
import type { Router } from "./pattern";

//
type HxClientRequestOptions<T = unknown> = keyof T extends never
  ? {
      headers?: Record<string, string>;
      fetch?: typeof fetch | HonoRequest;
    }
  : {
      headers: T;
      fetch?: typeof fetch | HonoRequest;
    };
type Methods =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";
type HtmxSpecifiedAttributes<M extends Methods> = Record<`hx-${M}`, string>;
type HxClientRequest<S extends Schema> = {
  [M in keyof S]: S[M] extends {
    input: infer R;
  }
    ? R extends object
      ? M extends `$${infer Method}`
        ? Method extends Methods
          ? HasRequiredKeys<R> extends true
            ? (
                args: Omit<R, "form">,
                options?: HxClientRequestOptions,
              ) => HtmxSpecifiedAttributes<Method>
            : (
                args?: Omit<R, "form">,
                options?: HxClientRequestOptions,
              ) => HtmxSpecifiedAttributes<Method>
          : never
        : never
      : never
    : never;
} & {
  $url: (
    arg?: S[keyof S] extends {
      input: infer R;
    }
      ? R extends {
          param: infer P;
        }
        ? {
            param: P;
          }
        : {}
      : {},
  ) => URL;
};
type PathToChain<
  Path extends string,
  E extends Schema,
  Original extends string = "",
> = Path extends `/${infer P}`
  ? PathToChain<P, E, Path>
  : Path extends `${infer P}/${infer R}`
    ? {
        [K in P]: PathToChain<R, E, Original>;
      }
    : {
        [K in Path extends "" ? "index" : Path]: HxClientRequest<
          E extends Record<string, unknown> ? E[Original] : never
        >;
      };
type HxClient<T> =
  T extends HonoBase<any, infer S, any>
    ? S extends Record<infer K, Schema>
      ? K extends string
        ? PathToChain<K, S>
        : never
      : never
    : never;

export const hx_urls = hc<Router>("http://localhost:3000", {
  fetch: function hx_props(raw_url: string, options: RequestInit) {
    // NOTE(douglasduteil): do not fetch
    // This is a hack to make the type system happy
    // One does not simply fetch the server while servering the response
    //
    // Should be use to link internal urls with
    // app_hc.api.posts.$get() // { "hx-get": "/api/posts" }
    //
    // see https://hono.dev/guides/rpc#url
    const url = new URL(raw_url);
    const hx_val =
      options.body instanceof FormData
        ? { "hx-vals": JSON.stringify(Object.fromEntries(options.body)) }
        : {};
    // consola.trace({ raw_url, options, hx_val });
    return {
      [`hx-${options.method?.toLowerCase()}`]: `${url.pathname}${url.search}`,
      ...hx_val,
    };
  },
} as any) as any as UnionToIntersection<HxClient<Router>>;
