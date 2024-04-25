import {
  Integrations,
  SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN,
  SEMANTIC_ATTRIBUTE_SENTRY_SOURCE,
  addRequestDataToEvent,
  continueTrace,
  init,
  setHttpStatus,
  startSpan,
  withScope,
} from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import config from "@~/app.core/config";
import consola, { LogLevels } from "consola";
import { createMiddleware } from "hono/factory";

export function sentry() {
  init({
    attachStacktrace: true,
    debug: consola.level >= LogLevels.debug,
    dsn: config.SENTRY_DNS,
    environment: config.DEPLOY_ENV,
    initialScope: {
      tags: {
        NODE_ENV: config.NODE_ENV,
        HOST: config.HOST,
        GIT_SHA: config.GIT_SHA,
      },
    },
    integrations: [
      new Integrations.Postgres(),
      new Integrations.Http({ tracing: true }),
      nodeProfilingIntegration(),
    ],
    profilesSampleRate: 1,
    release: config.VERSION,
    tracesSampleRate: 1,
  });

  return createMiddleware(async function sentry_middleware(c, next) {
    if (
      c.req.method.toUpperCase() === "OPTIONS" ||
      c.req.method.toUpperCase() === "HEAD"
    ) {
      return next();
    }

    return withScope((scope) => {
      const sentryTrace = c.req.header("sentry-trace")
        ? c.req.header("sentry-trace")
        : undefined;
      const baggage = c.req.header("baggage");
      const { url, method } = c.req;
      const headers = Object.fromEntries(c.res.headers);

      scope.setSDKProcessingMetadata({
        request: {
          url,
          method,
          headers,
        },
      });

      return continueTrace({ sentryTrace, baggage }, () =>
        startSpan(
          {
            attributes: {
              [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.node",
              "http.request.method": c.req.method || "GET",
              [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url",
            },
            op: "http.server",
            name: `${c.req.method} ${c.req.path || "/"}`,
          },
          async (span) => {
            scope.addEventProcessor((event) =>
              addRequestDataToEvent(
                event,
                {
                  method: c.req.method,
                  url: c.req.url,
                },
                {
                  include: {
                    user: false,
                  },
                },
              ),
            );
            c.set("sentry", scope);
            await next();

            if (!span) {
              return;
            }

            setHttpStatus(span, c.res.status);
            scope.setContext("response", {
              headers: Object.fromEntries(c.res.headers),
              status_code: c.res.status,
            });
          },
        ),
      );
    });
    // const scope = getCurrentScope();
    // scope.addEventProcessor((event) =>
    //   addRequestDataToEvent(
    //     event,
    //     {
    //       method: c.req.method,
    //       url: c.req.url,
    //     },
    //     {
    //       include: {
    //         user: false,
    //       },
    //     },
    //   ),
    // );
    // c.set("sentry", scope);
    // await next();
    // const scope = getCurrentScope();
    // c.set("sentry", scope);

    // const sentryTrace = c.req.header("sentry-trace")
    //   ? c.req.header("sentry-trace")
    //   : undefined;
    // const baggage = c.req.header("baggage");
    // const url = c.req.url;
    // await continueTrace({ sentryTrace, baggage }, (ctx) =>
    //   startSpan(
    //     {
    //       op: "http.server",
    //       name: `${c.req.method} ${c.req.path || "/"}`,
    //       origin: "auto.http.node.tracingHandler",
    //       // ...ctx,
    //       // metadata: {
    //       //   ...ctx.metadata,
    //       //   request: c.req.raw as any,
    //       //   source,
    //       // }
    //       // data,
    //       // metadata: {
    //       //   source: "url",
    //       //   request: {
    //       //     url,
    //       //     method: c.req.method,
    //       //     headers: c.req.header(),
    //       //   },
    //       // },
    //     },
    //     async (span) => {
    //       // getCurrentScope().setSDKProcessingMetadata({
    //       //   request: c.req.raw,
    //       // });
    //       scope.addEventProcessor((event) =>
    //         addRequestDataToEvent(
    //           event,
    //           {
    //             method: c.req.method,
    //             url: c.req.url,
    //           },
    //           {
    //             include: {
    //               user: false,
    //             },
    //           },
    //         ),
    //       );

    //       await next();

    //       if (span) {
    //         setHttpStatus(span, c.res.status);
    //       }
    //     },
    //   ),
    // );
  });
}
