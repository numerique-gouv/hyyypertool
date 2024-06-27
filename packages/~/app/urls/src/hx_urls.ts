//

import type { Hono, HonoRequest, Schema } from "hono";
import { hc } from "hono/client";
import type { Endpoint } from "hono/types";
import type { HasRequiredKeys, UnionToIntersection } from "hono/utils/types";
import type { SetOptional } from "type-fest";
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

type HtmxSpecifiedAttributes<
  Method extends Methods,
  Input extends SetOptional<Endpoint["input"], "form">,
  TForm = Input["form"],
> =
  Extract<TForm, undefined> extends never // IsNullable<TForm>
    ? HasRequiredKeys<NonNullable<TForm>> extends true
      ? Record<`hx-${Method}`, string> & Record<`hx-vals`, string>
      : Record<`hx-${Method}`, string>
    : Record<`hx-${Method}`, string>;

type HxClientRequest<TSchema extends Schema> = {
  [$$Method in keyof TSchema]: TSchema[$$Method] extends Endpoint & {
    input: infer $Input;
  }
    ? { input: $Input; method: $$Method } extends {
        input: Endpoint["input"];
        method: `$${infer Method}`;
      }
      ? Method extends Methods
        ? $Input extends Endpoint["input"]
          ? HasRequiredKeys<Omit<$Input, "form">> extends true
            ? <$Args extends SetOptional<$Input, "form">>(
                args: $Args,
                options?: HxClientRequestOptions,
              ) => HtmxSpecifiedAttributes<Method, $Args>
            : <$Args extends SetOptional<$Input, "form">>(
                args?: $Args,
                options?: HxClientRequestOptions,
              ) => HtmxSpecifiedAttributes<Method, $Args>
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
  T extends Hono<any, infer $Schema, any>
    ? $Schema extends Record<infer $Path, Schema>
      ? $Path extends string
        ? PathToChain<$Path, $Schema>
        : never
      : never
    : never;

export function hono_hx_attibute<
  T extends Hono<any, any, any>,
>(): UnionToIntersection<HxClient<T>> {
  return hc<T>("http://localhost:3000", {
    fetch(input: string, options: any) {
      const init: RequestInit = options;
      const url = new URL(input);
      const attribute = `hx-${init.method?.toLowerCase()}`;
      const hx_val =
        options.body instanceof FormData
          ? { "hx-vals": JSON.stringify(Object.fromEntries(options.body)) }
          : {};
      return { [attribute]: `${url.pathname}${url.search}`, ...hx_val } as any;
    },
  }) as any;
}

export const hx_urls = hono_hx_attibute<Router>();
//   fetch: function hx_props(raw_url: string, options: RequestInit) {
//     // NOTE(douglasduteil): do not fetch
//     // This is a hack to make the type system happy
//     // One does not simply fetch the server while servering the response
//     //
//     // Should be use to link internal urls with
//     // app_hc.api.posts.$get() // { "hx-get": "/api/posts" }
//     //
//     // see https://hono.dev/guides/rpc#url
//     const url = new URL(raw_url);
//     const hx_val =
//       options.body instanceof FormData
//         ? { "hx-vals": JSON.stringify(Object.fromEntries(options.body)) }
//         : {};
//     const attribute = `hx-${options.method?.toLowerCase()}`;
//     // console.log("@~/app.urls/src/hx_urls.ts:hx_props", {
//     //   attribute,
//     //   value: `${url.pathname}${url.search}`,
//     //   raw_url,
//     //   options,
//     //   url,
//     //   hx_val,
//     // });
//     // consola.trace({ raw_url, options, hx_val });
//     // return {
//     // [attribute]: `${url.pathname}${url.search}`,
//     // ...hx_val,
//     // };
//     return url;
//   },
// } as any) as any as UnionToIntersection<HxClient<Router>>;
