export function toArray(mixed) {
	return Array.isArray(mixed) ? mixed : [mixed];
}

export async function handleFetch(
	requestHandlers = [],
	responseHandlers = []
) {
	addEventListener('fetch', (event) => {
		event.passThroughOnException();
		requestHandlers = toArray(requestHandlers);
		responseHandlers = toArray(responseHandlers);

		async function makeResponse(originalRequest) {
			console.group(originalRequest.url);
			console.log('🎬', originalRequest);

			// Request starts out as the original request.
			let request = originalRequest;
			let response;

			// Loop through request handlers.
			try {
				for (const requestHandler of requestHandlers) {
					let beforeRequest = request;
					request = await requestHandler(request);

					// Request handlers can bail early and return a response.
					if (request instanceof Response) {
						throw request;
					} else if (request.url !== beforeRequest.url) {
						console.log('✏️', request.url, request);
					}
				}
			} catch (request) {
				response = request;
				if (isRedirect(response)) {
					console.log(
						`⏪ ${response.status}`,
						response.headers.get('location'),
						response
					);
				} else {
					console.log('⏪', response);
				}
			}

			// If we don't already have a response, we should fetch the request.
			if (!response) {
				// Fetch.
				console.log('➡️', request.url);
				response = await fetch(request);
				console.log('⬅️', response);
			}

			// If there are response handlers, loop through them.
			for (const responseHandler of responseHandlers) {
				response = await responseHandler(response, request, originalRequest);
			}

			if (isRedirect(response)) {
				console.log(
					`⤴️ ${response.status}`,
					response.headers.get('location') || '',
					response
				);
			} else {
				console.log('✅', response);
			}

			console.groupEnd();

			return response;
		}

		event.respondWith(makeResponse(event.request));
	});
}

/**
 * Whether the given response is a redirect.
 *
 * @param Response A response object.
 * @return boolean
 */
export function isRedirect({ status, headers }) {
	return status >= 300 && status < 400 && headers.get('location');
}

export function setRequestUrl(url, request, options = {}) {
	return new Request(url, {
		body: request.body,
		headers: request.headers,
		method: request.method,
		redirect: request.redirect,
		...options,
	});
}

/**
 * Gets the cookie with the name from the request headers
 *
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to get
 */
export function getCookie(request, name) {
	let result = "";
	const cookieString = request.headers.get("Cookie");
	if (cookieString) {
		const cookies = cookieString.split(";");
		cookies.forEach(cookie => {
			const cookiePair = cookie.split("=", 2);
			const cookieName = cookiePair[0].trim();
			if (cookieName === name) {
				const cookieVal = cookiePair[1];
				result = cookieVal;
			}
		});
	}
	return result;
}

export function redirect(url, status = 302) {
	const response = Response.redirect(`${url}`, status);

	return new Response(response.body, response);
}