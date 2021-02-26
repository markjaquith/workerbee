import partial from 'lodash/partial';
import { match } from 'path-to-regexp';

export type MethodRegistrar = (pattern: string, ...Handler) => Router;

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

export class Router {
	private routes: any[] = [];
	connect: MethodRegistrar;
	delete: MethodRegistrar;
	get: MethodRegistrar;
	head: MethodRegistrar;
	options: MethodRegistrar;
	patch: MethodRegistrar;
	post: MethodRegistrar;
	put: MethodRegistrar;
	trace: MethodRegistrar;
	all: MethodRegistrar;

	constructor() {
		for (const method of METHODS) {
			this[method.toLowerCase()] = partial(this.register, method);
		}

		this.all = partial(this.register, '*');
	}

	register(method: String, url: String, handlers) {
		this.routes.push({
			method,
			url,
			handlers,
		});

		return this;
	}

	getRoute(request) {
		for (const route of this.routes) {
			// If the method does not match, continue.
			if (![request.method, '*'].includes(route.method)) {
				continue;
			}

			const parsed = match(route.url)(new URL(request.url).pathname);

			if (parsed) {
				route.handlers = { request: null, response: null, ...route.handlers };
				return {
					...route,
					params: parsed.params,
				};
			}
		}

		// No match. Return a nulled out object.
		return {
			method: request.method,
			url: null,
			handlers: {
				request: null,
				response: null,
			},
			params: {},
		};
	}
}

export default Router;
