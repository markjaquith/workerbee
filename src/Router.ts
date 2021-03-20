import { partial, toArray } from './utils';
import { Handler, Handlers } from './RequestManager';
import HostRouter from './HostRouter';
import MethodRouter from './MethodRouter';
import PathRouter from './PathRouter';
import BaseRouter, {
	Route,
	RouterCallback,
	RouterHandlers,
	HandlerMap,
} from './BaseRouter';

export type MethodRegistrar = (pattern: string, ...Handler) => Router;
export interface Params {
	[key: string]: string | string[];
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
			this[method.toLowerCase()] = partial(this.register, [method]);
		}

		this.all = partial(this.register, ['*']);
	}

	isHandlerMap(handler: HandlerMap | Handler): handler is HandlerMap {
		return (
			handler.hasOwnProperty('request') || handler.hasOwnProperty('response')
		);
	}

	makeHandlers(
		handler: Handler | HandlerMap,
		...otherHandlers: Handler[]
	): RouterHandlers {
		let pushedHandlers: RouterHandlers = {
			request: [],
			response: [],
		};

		if (this.isHandlerMap(handler)) {
			Object.assign(pushedHandlers, handler);
		} else {
			pushedHandlers.request = [handler, ...otherHandlers] as Handler[];
		}

		return pushedHandlers;
	}

	register(
		method: string,
		pathPattern: string,
		handler: HandlerMap | Handler,
		...otherHandlers: Handler[]
	): this {
		this.addRouter(
			new MethodRouter(method).addRouter(
				new PathRouter(pathPattern).setHandlers(
					this.makeHandlers(handler, ...otherHandlers),
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
