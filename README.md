# cf-worker-utils: Cloudflare Worker Utilities

![minified and zipped size](https://img.shields.io/bundlephobia/minzip/cf-worker-utils)

This is a simple package for composing Cloudflare Workers, focused on the use
case of having an upstream server, and wanting to conditionally manipulate requests
and responses.

## Table of Contents
- [Concepts](#concepts)
- [Usage](#usage)
- [Lifecycle](#lifecycle)
- [Routing](#routing)
- [Handlers](#handlers)
- [Best Practices](#best-practices)

## Concepts

* **Handler** — An async function that is run when a request is being received,
and/or a response from the server/cache is coming back. It can change the
request/response, deliver a new request/response altogether, or conditionally
add other handlers.
* **Route** — A request path pattern with handlers thare are only added only for
requests that match the pattern.

## Usage

1. Bootstrap your Cloudflare worker, [using wrangler][wrangler]. Make sure
you&#8217;re using Webpack.
2. `npm i cf-worker-utils` from your Worker directory.
3. In your worker, import `handleFetch` and provide an array of request/response
handlers, and/or route-limited request/response handlers.

Example:

```
import handleFetch from 'cf-worker-utils';

handleFetch({
	request: requestHandlers, // Run on every request.
	response: responseHandler, // Run on every response.
	routes: router => {
		router.get('/test', {
			request: requestHandlers, // Run on matching requests.
			response: responseHanders, // Run on responses from matching requests.
		});

		router.get('/posts/:id', {
			request: requestHandlers, // Run on matching requests.
			response: responseHandlers, // Run on responses from matching requests.
		})
	},
});
```

Top level request and response handlers will be run on every route, *before* any
route-specific handlers.

For all places where you specify handlers, you can provide one handler, an
array of handlers, or no handlers (null, or empty array).

## Lifecycle
It goes like this:

1. `Request` is received.
2. The `Request` loops through all request handlers (global, and then route).
3. If early `Response` wasn't received, the resulting `Request` object is fetched (from the cache or the server).
4. The resulting `Response` object is passed through the response handlers (global, and then route).
5. The response is returned to the client.

```
  ┌──────────────────┐
  │ Incoming Request │
  │  to your Worker  │
  └──────────────────┘
            │
            ▼
    .───────────────.
   (  Matches route? )───Yes─┐
    `───────────────'        │
            │                ▼
            │    ┌───────────────────────┐
           No    │ Append route handlers │
            │    │  to global handlers   │
            │    └───────────────────────┘
            │                │
            └───────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │    Run next     │
 ┌────────▶│ request handler │
 │         └─────────────────┘
 │                  │
 │                  ▼
 │   .─────────────────────────────.
 │  ( Handler returned a Response?  )───┐
 │   `─────────────────────────────'    │
 │                  │                  Yes
 │                 No                   │
Yes                 │                   │
 │                  ▼                   │
 │          .───────────────.           │
 └─────────(  More handlers? )          │
            `───────────────'           │
                    │                   │
                   No                   │
                    │                   │
                    ▼                   │
         .─────────────────────.        │
  ┌─────(  Request in CF cache? )────┐  │
  │      `─────────────────────'     │  │
 Yes                                No  │
  │  ┌────────────┐  ┌────────────┐  │  │
  │  │ Fetch from │  │ Fetch from │  │  │
  └─▶│   cache    │  │   server   │◀─┘  │
     └────────────┘  └────────────┘     │
            │               │           │
            └───────┬───────┘           │
                    │                   │
                    ▼                   │
              ┌──────────┐              │
              │ Response │◀─────────────┘
              └──────────┘
                    │
                    ▼
          ┌──────────────────┐
          │     Run next     │
      ┌──▶│ response handler │
      │   └──────────────────┘
      │             │
     Yes            ▼
      │     .───────────────.
      └────(  More handlers? )
            `───────────────'
                    │
                   No
                    │
                    ▼
           ┌────────────────┐
           │ Final Response │
           └────────────────┘
```

## Routing

The router has functions for all HTTP methods, plus `router.any()` which matches
any method. The path argument uses the [path-to-regexp][path-to-regexp] library,
which has good support for positional path parameters. Here's what various routes
would yield for a given request:

* `/posts/:id`
  * ✅ `/posts/123` ➡️ `{id: "123"}`
  * ✅ `/posts/123/` ➡️ `{id: "123"}`
  * ✅ `/posts/hello` ➡️ `{id: "hello"}`
  * ❌ `/posts/123/more`
  * ❌ `/posts/`
  * ❌ `/posts`
* `/posts/:id(\\d+)`
  * ✅ `/posts/123` ➡️ `{id: "123"}`
  * ❌ `/posts/word`
* `/posts/:id?`
  * ✅ `/posts/123` ➡️ `{id: "123"}`
  * ✅ `/posts/hello` ➡️ `{id: "hello"}`
  * ✅ `/posts/` ➡️ `{}`
  * ✅ `/posts` => `{}`
  * ❌ `/posts/123/more`
* `/posts/:id+`
  * ✅ `/posts/123` ➡️ `{id: "123"}`
  * ✅ `/posts/123/456` ➡️ `{id: ["123", "456"]}`
  * ✅ `/posts/123/hello` ➡️ `{id: ["123", "hello"]}`
  * ❌ `/posts/`
  * ❌ `/posts`
* `/posts/:id(\\d+)+`
  * ✅ `/posts/123` ➡️ `{id: "123"}`
  * ✅ `/posts/123/456` ➡️ `{id: ["123", "456"]}`
  * ❌ `/posts/123/hello`
  * ❌ `/posts/`
  * ❌ `/posts`
* `/bread/:meat+/bread`
  * ✅ `/bread/turkey/bread` ➡️ `{meat: "turkey"}`
  * ✅ `/bread/peanut-butter/jelly/bread` ➡️ `{meat: ["peanut-butter", "jelly"]}`
  * ❌ `/bread/bread`
* `/mother{-:type}?`
  * ✅ `/mother` ➡️ `{}`
  * ✅ `/mother-in-law` ➡️ `{type: "in-law"}`
  * ❌ `/mothers`

If you want to match a path prefix and everything after it, just use a wildcard
matcher: `/prefix/:any*`.

Go read the [path-to-regex documentation][path-to-regexp] for more information.

[path-to-regexp]: https://github.com/pillarjs/path-to-regexp#readme

## Handlers
Handlers should be `async` functions. They are passed an object that contains:

```js
{
	handlers,
	originalRequest,
	request,
	response, // Only for response handlers.
	params,
	phase,
}
```

- `handlers` — The instance of the `RequestManager` object, which has:
  - `addRequest(handler, options)` — dynamically adds another request handler (pass `{immediate: true}` to add it as the first or next handler).
  - `addResponse(handler, options)` — dynamically adds another response handler (pass `{immediate: true}` to add it as the first or next handler).
- `request` — A `Request` object representing the current state of the request.
- `originalRequest` — The original `Request` object (might be different if other handlers
returned a new request).
- `response` — A `Response` object with the current state of the response.
- `params` — An object containing any param matches from the route.
- `phase` — One of `"request"` or `"response"`.

Request handlers can return three things:

1. Nothing — the current request will be passed on to the rest of the request
handlers.
2. A new `Request` object — this will get passed on to the rest of the request
handlers.
3. A `Response` object — this will skip the rest of the request handlers and get
passed through the response handlers.

Response handlers can return two things:

1. Nothing — the current response will be passed on to the rest of the repsonse
handlers.
2. A new `Response` object — this will get passed on to the rest of the request
handlers.

## Best Practices

1. Always return a new Request or Response object if you want to change things.
2. Don't return anything if your handler is declining to act.
3. If you have a response handler that is only needed based on what a request
handler does, conditionally add that response handler on the fly in the request
handler.

[wrangler]: https://developers.cloudflare.com/workers/learning/getting-started

## License

MIT License

Copyright &copy; 2020–2021 Mark Jaquith

---

This software incorporates work covered by the following copyright and permission notices:

[tsndr/cloudflare-worker-router](https://github.com/tsndr/cloudflare-worker-router)\
Copyright &copy; 2021 Tobias Schneider\
(MIT License)
