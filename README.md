# cf-worker-utils

![minified and zipped size](https://img.shields.io/bundlephobia/minzip/cf-worker-utils)

This is a simple package for composing Cloudflare Workers, focused on the normal
use case of having an upstream server, and wanting to manipulate requests and
responses.

## Usage

1. Bootstrap your Cloudflare worker, [using wrangler][wrangler]. Make sure you&#8217;re using Webpack.
2. `npm i cf-worker-utils` from your worker directory.
3. In your worker, import `handleFetch` and provide an array of request and/or
response handlers, and/or route-limited request/response handlers.

example:

```
import handleFetch from 'cf-worker-utils';

handleFetch({
	request: requestHandlers,
	response: responseHandler,
	routes: router => {
		router.get('/test', {
			request: requestHandlers,
			response: responseHanders,
		});

		router.get('/', {
			request: requestHandlers,
			response: responseHandlers,
		})
	},
});
```

Top level request and response handlers will be run on every route, before any
route-specific handlers.

For all places where you specify handlers, you can provide one handler, an
array of handlers, or no handlers (null, or empty array).

## Handlers
Handlers should be `async` functions. They are passed an object that contains:

```js
{
	handlers,
	originalRequest,
	request,
	response,
	params,
	phase,
}
```

-`handlers` — The instance of the `RequestManager` object, which has:
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

## Lifecycle
It goes like this:

1. `Request` is received.
2. The `Request` loops through all request handlers.
3. If early `Response` wasn't received, the resulting `Request` object is fetched.
4. The resulting `Response` object is passed through the response handlers.
5. The response is returned to the client.

## Best practices

1. Always return a new Request or Response object if you want to change things.
2. Don't return anything if your handler is declining to act.
3. If you have a response handler that is only needed based on what a request
handler does, add that response handler on the fly in the request handler.

[wrangler]: https://developers.cloudflare.com/workers/learning/getting-started

## License

MIT License

Copyright &copy; 2020–2021 Mark Jaquith

---

This software incorporates work covered by the following copyright and permission notices:

[tsndr/cloudflare-worker-router](https://github.com/tsndr/cloudflare-worker-router)\
Copyright &copy; 2021 Tobias Schneider\
(MIT License)
