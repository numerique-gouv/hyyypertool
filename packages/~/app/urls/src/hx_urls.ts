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
type HtmxSpecifiedAttributes<Method extends Methods> = Record<
  `hx-${Method}`,
  string
>;
type HxClientRequest<TSchema extends Schema> = {
  [$Method in keyof TSchema]: TSchema[$Method] extends {
    input: infer $Input;
  }
    ? $Input extends object
      ? $Method extends `$${infer Method}`
        ? Method extends Methods
          ? HasRequiredKeys<$Input> extends true
            ? (
                args: Omit<$Input, "form">,
                options?: HxClientRequestOptions,
              ) => HtmxSpecifiedAttributes<Method>
            : (
                args?: Omit<$Input, "form">,
                options?: HxClientRequestOptions,
              ) => HtmxSpecifiedAttributes<Method>
          : never
        : never
      : never
    : never;
} & {
  $url: (
    arg?: TSchema[keyof TSchema] extends {
      input: infer $Input;
    }
      ? $Input extends {
          param: infer $Param;
        }
        ? {
            param: $Param;
          }
        : {}
      : {},
  ) => URL;
};
type PathToChain<
  TPath extends string,
  TSchema extends Schema,
  Original extends string = "",
> = TPath extends `/${infer $Path}`
  ? PathToChain<$Path, TSchema, TPath>
  : TPath extends `${infer $ParentPath}/${infer $SubPath}`
    ? {
        [K in $ParentPath]: PathToChain<$SubPath, TSchema, Original>;
      }
    : {
        [K in TPath extends "" ? "index" : TPath]: HxClientRequest<
          TSchema extends Record<string, unknown> ? TSchema[Original] : never
        >;
      };
type HxClient<T> =
  T extends HonoBase<any, infer $Schema, any>
    ? $Schema extends Record<infer $Path, Schema>
      ? $Path extends string
        ? PathToChain<$Path, $Schema>
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
