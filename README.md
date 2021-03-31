# Worker Bee: 🐝 Cloudflare Worker Composer ☁️

![minified and zipped
size](https://img.shields.io/bundlephobia/minzip/workerbee)
![Tests](https://github.com/markjaquith/workerbee/actions/workflows/tests.yml/badge.svg)

Toolkit for composing Cloudflare Workers, focused on the use
case of having an upstream server, and wanting to conditionally manipulate
requests and responses.

## Example Uses

- All requests to `/landing-page/` should strip that subdirectory and proxy from
  Netlify instead of your normal server.
- Requests from the `googleweblight` user agent should have `Cache-Control: no-transform`
  set on the response.
- Cookies should be stripped for requests to the `/shop/` section of your site.
- UTM parameters and Facebook click IDs should be removed from requests to your
  server to increase cacheability.
- WordPress users should not be logged in on the front of the site unless they’re
  previewing a post.
- Make your entire site HTTPS except for one section.
- Make all images use browser-native lazy loading.

If you'd like, jump straight to [the examples](docs/examples.md).

## Table of Contents

- [Concepts](#concepts)
- [Usage](#usage)
- [Lifecycle](#lifecycle)
- [Routing](#routing)
- [Handlers](#handlers)
- [Bundled Handlers](#bundled-handlers)
- [Logic](#logic)
- [Conditions](#conditions)
- [Best Practices](#best-practices)

## Concepts

Cloudflare Worker Utilities is based around three main concepts:

- **Handlers** — Functions that are run when a request is being received,
  and/or a response from the server/cache is coming back. They can change the
  request/response, deliver a new request/response altogether, or conditionally
  add other handlers.
- **Routes** — Host/route request path patterns with handlers thare are only added only for
  requests that match the pattern.
- **Conditions** — Functions that determine whether a handler should be applied.

## Usage

1. Bootstrap your Cloudflare Worker, [using Wrangler][wrangler]. Make sure
   you’re using Webpack.
2. `npm i workerbee` from your Worker directory.
3. In your Worker, import `handleFetch` and provide an array of request/response
   handlers, and/or route-limited request/response handlers.

Example:

```js
import handleFetch from 'workerbee'

handleFetch({
	request: requestHandlers, // Run on every request.
	response: responseHandler, // Run on every response.
	routes: (router) => {
		router.get('/test', {
			request: requestHandlers, // Run on matching requests.
			response: responseHanders, // Run on responses from matching requests.
		})

		router.get('/posts/:id', {
			request: requestHandlers, // Run on matching requests.
			response: responseHandlers, // Run on responses from matching requests.
		})
	},
})
```

Top level request and response handlers will be run on every route, _before_ any
route-specific handlers.

For all places where you specify handlers, you can provide one handler, an array
of handlers, or no handlers (null, or empty array). Routes can also accept
variadic handlers, which will be assumed to be request handlers.

## Lifecycle

It goes like this:

1. `Request` is received.
2. The `Request` loops through all request handlers (global, and then route).
3. If early `Response` wasn’t received, the resulting `Request` object is
   fetched (from the cache or the server).
4. The resulting `Response` object is passed through the response handlers
   (global, and then route).
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
any method. e.g. `router.get(path, handlers)`, `router.post(path, handlers)`.

The path argument uses the [path-to-regexp][path-to-regexp] library,
which has good support for positional path parameters. Here’s what various
routes would yield for a given request:

| Pattern                    | 🆗  | URL                                | Params                               |
| -------------------------- | --- | ---------------------------------- | ------------------------------------ |
| `/posts/:id`               |     |                                    |                                      |
|                            | ✅  | `/posts/123`                       | `{id: "123"}`                        |
|                            | ✅  | `/posts/hello`                     | `{id: "hello"}`                      |
|                            | ❌  | `/posts`                           |                                      |
| `/posts/:id?`              |     |                                    |                                      |
|                            | ✅  | `/posts/123`                       | `{id: "123"}`                        |
|                            | ✅  | `/posts/hello`                     | `{id: "hello"}`                      |
|                            | ✅  | `/posts`                           | `{}`                                 |
|                            | ❌  | `/posts/hello/another`             |                                      |
| `/posts/:id(\\d+)/:action` |     |                                    |                                      |
|                            | ✅  | `/posts/123/edit`                  | `{id: "123", action: "edit"}`        |
|                            | ❌  | `/posts/hello/edit`                |                                      |
| `/posts/:id+`              |     |                                    |                                      |
|                            | ✅  | `/posts/123`                       | `{id: ["123"]}`                      |
|                            | ✅  | `/posts/123/hello/there`           | `{id: ["123", "hello", "there"]}`    |
| `/posts/:id*`              |     |                                    |                                      |
|                            | ✅  | `/posts`                           | `{}`                                 |
|                            | ✅  | `/posts/123`                       | `{id: ["123"]}`                      |
|                            | ✅  | `/posts/123/hello`                 | `{id: ["123", "hello"]}`             |
| `/bread/:meat+/bread`      |     |                                    |                                      |
|                            | ✅  | `/bread/turkey/bread`              | `{meat: ["turkey"]}`                 |
|                            | ✅  | `/bread/peanut-butter/jelly/bread` | `{meat: ["peanut-butter", "jelly"]}` |
|                            | ❌  | `/bread/bread`                     |                                      |
| `/mother{-:type}?`         |     |                                    |                                      |
|                            | ✅  | `/mother`                          | `{}`                                 |
|                            | ✅  | `/mother-in-law`                   | `{type: "in-law"}`                   |
|                            | ❌  | `/mothers`                         |                                      |

If you want to match a path prefix and everything after it, just use a wildcard
matcher like `/prefix/:any*` (and then just ignore what gets matched by `:any*`).

Note that a trailing slash will match, so `/posts/` will match `/posts`.

Go read the [path-to-regex documentation][path-to-regexp] for more information.

[path-to-regexp]: https://github.com/pillarjs/path-to-regexp#readme

You can also limit your routes to a specific host, like so:

```js
import handleFetch, { forbidden, setRequestHeaders } from 'workerbee'

handleFetch({
	routes: (router) => {
		router.host('example.com', (router) => {
			router.get('/', setRequestHeaders({ 'x-foo': 'bar' }))
		})
		router.host('*.blogs.example.com', (router) => {
			router.any('/xmlrpc.php', forbidden())
		})
	},
})
```

This makes it trivial to set up a Worker that services multiple subdomains and
routes, instead of having to maintain a bunch of independent Workers.

## Handlers

Handlers are functions (preferably `async` functions). They are passed an object
that contains:

```js
{
  addRequestHandler(),
  addResponseHandler(),
  addCfPropertiesHandler(),
  originalRequest,
  request,
  response,
  current,
  params,
  phase,
}
```

- `addRequestHandler(handler, options)` — dynamically adds another request
  handler (pass `{immediate: true}` to add it as the first or next handler).
- `addResponseHandler(handler, options)` — dynamically adds another response
  handler (pass `{immediate: true}` to add it as the first or next handler).
- `addCfPropertiesHandler(handler)` — adds a callback that receives and returns
  new properties to pass to `fetch()` on the `cf` key (see [Cloudflare
  documentation][cfpropertieshandlerdocs])
- `request` — A `Request` object representing the current state of the request.
- `originalRequest` — The original `Request` object (might be different if other
  handlers returned a new request).
- `response` — A `Response` object with the current state of the response. —
  `current` — During the request phase, this will equal `request`. During the
  response phrase, this will equal `response`. This is mostly used for
  conditions. For instance, the `header` condition works on either requests or
  responses, as both have headers. Thus it looks at `{ current: { headers } }`.
- `params` — An object containing any param matches from the route.
- `phase` — One of `"request"` or `"response"`.

[cfpropertieshandlerdocs]: https://developers.cloudflare.com/workers/runtime-apis/request#requestinitcfproperties

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

## Bundled Handlers

The following handlers are included:

- `setUrl(url: string)`
- `setHost(host: string)`
- `setPath(path: string)`
- `setProtocol(protocol: string)`
- `setHttps()`
- `setHttp()`
- `forbidden()`
- `setRequestHeaders([header: string, value: string][] | {[header: string]: string})`
- `appendRequestHeaders([header: string, value: string][] | {[header: string]: string})`
- `removeRequestHeaders(headers: string[])`
- `setResponseHeaders([header: string, value: string][] | {[header: string]: string})`
- `appendResponseHeaders([header: string, value: string][] | {[header: string]: string})`
- `removeResponseHeaders(headers: string[])`
- `copyResponseHeader(from: string, to: string)`
- `lazyLoadImages()`
- `prependPath(pathPrefix: string)`
- `removePathPrefix(pathPrefix: string)`
- `redirect(status: number)`
- `redirectHttps()`
- `redirectHttp()`
- `requireCookieOrParam(param: string, forbiddenMessage: string)`

## Logic

Instead of bundling logic into custom handlers, you can also use
`addHandlerIf(condition, ...handlers)` together with the `any()`, `all()` and
`none()` gates to specify the logic outside of the handler. Here’s an example:

```js
import {
	handleFetch,
	addHandlerIf,
	contains,
	header,
	forbidden,
} from 'workerbee'

handleFetch({
	request: [
		addHandlerIf(
			any(
				header('user-agent', contains('Googlebot')),
				header('user-agent', contains('Yahoo! Slurp')),
			),
			forbidden(),
			someCustomHandler(),
		),
	],
})
```

`addHandlerIf()` takes a single condition as its first argument, but you can
nest `any()`, `all()` and `none()` as much as you like to compose a more complex
condition.

## Conditions

As hinted above, there are several built-in conditions for you to use:

- `header(headerName: string, matcher: ValueMatcher)`
- `contentType(matcher: ValueMatcher)`
- `isHtml()`
- `hasParam(paramName: string)`
- `hasRouteParam(paramName: string)`
- `param(paramName: string, matcher: ValueMatcher)`
- `routeParam(paramName: string, matcher: ValueMatcher)`
- `isHttps()`
- `isHttps()`

The ones that take a string (or nothing) are straightforward, but what’s up with
`ValueMatcher`?

A `ValueMatcher` is flexible. It can be:

- `string` — will match if the string `===` the value.
- `string[]` — will match if any of the strings `===` the value.
- `ValueMatchingFunction` — a function that takes the value and returns a
  boolean that decides the match.
- `ValueMatchingFunction[]` — an array of functions that take the value, any of
  which can return true and decide the match.

The following `ValueMatchingFunction`s are available:

- `contains(value: string | NegatedString | CaseInsensitiveString | NegatedCaseInsensitiveString)`
- `startsWith(value: string | NegatedString | CaseInsensitiveString | NegatedCaseInsensitiveString)`
- `endsWith(value: string | NegatedString | CaseInsensitiveString | NegatedCaseInsensitiveString)`

These functions can also accept insensitive strings and negated strings with the
`text('yourtext').i` and `text('yourtext).not` helpers.

```js
addHandlerIf(
	header('User-Agent', startsWith(text('WordPress').not.i)),
	forbidden(),
)
```

Note that you can use logic functions to compose value matchers! So the example
from the Logic section could be rewritten like this:

```js
import {
	handleFetch,
	addHandlerIf,
	contains,
	header,
	forbidden,
} from 'workerbee'

handleFetch({
	request: [
		addHandlerIf(
			header(
				'user-agent',
				any(contains('Googlebot'), contains('Yahoo! Slurp')),
			),
			forbidden(),
			someCustomHandler(),
		),
	],
})
```

Two more points:

1. The built-in conditionals support partial application. So you can do this:

```js
const userAgent = header('user-agent')
```

Now, `userAgent` is a **function** that accepts a `ValueMatcher`.

You could take this further and do:

```js
const isGoogle = userAgent(startsWith('Googlebot'))
```

Now you could just add a handler like:

```js
handleFetch({
	request: [addHandlerIf(isGoogle, forbiddden)],
})
```

2. The built-in conditionals automatically apply to `current`. So if you run
   them as a request handler, header inspection will look at the request. As a
   response handler, it’ll look at response. But you can also use the raw
   conditionals while creating your own handlers. For instance, in a response
   handler you might want to look at the request that went to the server, or the
   originalRequest that came to Cloudflare.

```js
import forbidden from 'workerbee'
import { hasParam } from 'workerbee/conditions'

export default async function forbiddenIfFooParam({ request }) {
	if (hasParam('foo', request)) {
		return forbidden()
	}
}
```

In **most cases** you will not be reaching into the request from the response. A
better way to handle this is to have a request handler that conditionally adds a
response handler. But if you want to, you can, and you can use those "raw"
conditions to help. Note that the raw conditions will not be curried, and you'll
have to pass a request or response to them as their last argument.

## Best Practices

1. Always return a new Request or Response object if you want to change things.
2. Don’t return anything if your handler is declining to act.
3. If you have a response handler that is only needed based on what a request
   handler does, conditionally add that response handler on the fly in the
   request handler.
4. Use partial application of built-in conditionals to make your code easier to
   read.

[wrangler]: https://developers.cloudflare.com/workers/learning/getting-started

## License

MIT License

Copyright &copy; 2020–2021 Mark Jaquith

---

This software incorporates work covered by the following copyright and
permission notices:

[tsndr/cloudflare-worker-router](https://github.com/tsndr/cloudflare-worker-router)\
Copyright &copy; 2021 Tobias Schneider\
(MIT License)

[pillarjs/path-to-regexp](https://github.com/pillarjs/path-to-regexp#readme)\
Copyright &copy; 2014 Blake Embrey\
(MIT LICENSE)
