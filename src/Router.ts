import { partial } from './utils';
import { match } from 'path-to-regexp';
import { Handler, Handlers } from './RequestManager';
import HostRouter from './HostRouter';
import MethodRouter from './MethodRouter';
import PathRouter from './PathRouter';
import BaseRouter, {
	Route,
	RouterCallback,
	RouterHandlers,
	RouterInterface,
} from './BaseRouter';

export type MethodRegistrar = (pattern: string, ...Handler) => Router;
export interface Params {
	[key: string]: string | string[];
}

export interface HandlerMap {
	request?: Handlers;
	response?: Handlers;
}

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

export class Router extends BaseRouter {
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
		super();
		this.register = this.register.bind(this);

		for (const method of METHODS) {
			this[method.toLowerCase()] = partial(this.register, method);
		}

		this.all = partial(this.register, '*');
	}

	getPushedHandlers(handlers: HandlerMap | Handler[]) {
		const firstHandlerIsMap = handlers[0].request || handlers[0].response;
		let pushedHandlers: RouterHandlers = {
			request: [],
			response: [],
		};

		if (!firstHandlerIsMap) {
			pushedHandlers.request = handlers as Handler[];
		} else {
			pushedHandlers = handlers[0];
		}

		return pushedHandlers;
	}

	// This top level Router always matches, so that its underlying Routers are called.
	matches(): true {
		return true;
	}

	register(method: string, pathPattern: string, ...handlers): this {
		this.addRouter(
			new MethodRouter(method).addRouter(
				new PathRouter(pathPattern).setHandlers(
					this.getPushedHandlers(handlers),
				),
			),
		);

		return this;
	}

	getRoute(request: Request): Route | null {
		for (const router of this.routers) {
			const route = router.getRoute(request);
			if (route) {
				return route;
			}
		}

		return null;
	}

	host(hostPattern: string, fn: RouterCallback): this {
		this.addRouter(
			new HostRouter(hostPattern)
				.setCallbackRouterCreator(() => new Router())
				.addCallback(fn),
		);

		return this;
	}
}

export default Router;
