import cookie from 'cookie';

export type ValueMatchingFunction = (value: string) => boolean;
export type ValueMatcher =
	| string
	| string[]
	| ValueMatchingFunction
	| ValueMatchingFunction[];

export function toArray(mixed) {
	if (null === mixed || undefined === mixed) {
		return [];
	}

	return Array.isArray(mixed) ? mixed : [mixed];
}

export function redirect(url, status = 302) {
	const response = Response.redirect(`${url}`, status);

	return new Response(null, response);
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
		...request,
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
	const cookies = cookie.parse(request.headers.get('cookie') || '');

	return cookies[name] || null;
}

export function testing() {
	return process.env.JEST_WORKER_ID !== undefined;
}

export function matchesValue(test: ValueMatcher, value: string) {
	switch (typeof test) {
		case 'function':
			return test(value);
		case 'string':
			return test === value;
		default:
			for (const eachTest of test) {
				if (matchesValue(eachTest, value)) {
					return true;
				}
			}

			return false;
	}
}
