import partial from 'lodash/partial';

const METHODS = [
	'CONNECT',
	'DELETE',
	'GET',
	'HEAD',
	'OPTIONS',
	'PATCH',
	'POST',
	'PUT',
	'TRACE',
];

export default class Router {
	constructor() {
		this.routes = [];

		for (const method of METHODS) {
			this[method.toLowerCase()] = partial(this.register, method);
		}

		this.all = partial(this.register, '*');
	}

	register(method, url, handlers) {
		this.routes.push({
			method,
			url,
			handlers,
		});

		return this;
	}

	getRoute(request) {
		const nullRoute = {
			method: request.method,
			url: null,
			handlers: {
				request: null,
				response: null,
			},
		};
		const requestParts = new URL(request.url).pathname
			.split('/')
			.filter((i) => i);
		let params = {};
		const route =
			this.routes.find((r) => {
				const routeParts = r.url.split('/').filter((i) => i);
				// If the method does not match, or the number of path segments doesn't match, no match.
				if (
					![request.method, '*'].includes(r.method) ||
					routeParts.length !== requestParts.length
				) {
					return false;
				}

				// Reset the params for looking at this route.
				params = {};

				for (let i = 0; i < routeParts.length; i++) {
					const requestPart = requestParts[i];
					const routePart = routeParts[i];
					const isPlaceholder = routePart[0] === ':';

					// If the current path segment doesn't match and isn't a placeholder, no match.
					if (routePart !== requestPart && !isPlaceholder) {
						return false;
					}

					// If this a placeholder, set the param
					if (isPlaceholder) {
						params[routePart.substring(1)] = requestPart;
					}
				}

				return true;
			}) || nullRoute;
		route.handlers = { request: null, response: null, ...route.handlers }

		return { ...route, params };
	}
}
