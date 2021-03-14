import { Handler, Handlers } from './RequestManager';

type RouterCallback = (RouterInterface) => void;

export interface Params {
	[key: string]: string | string[];
}

export interface Route {
	method: string;
	url: string;
	handlers: {
		request: Handlers | null;
		response: Handlers | null;
	};
	params: Params;
}

export interface HandlerMap {
	request?: Handlers;
	response?: Handlers;
}

export interface RouterHandlers {
	request: Handler[];
	response: Handler[];
}

export interface RouterInterface {
	getRoute(request: Request): Route | null;
	addRouter(router: RouterInterface): this;
	addResponseHandler(handler: Handler): this;
	addRequestHandler(handler: Handler): this;
	addCallback(RouterCallback): this;
	matches(request: Request): boolean;
	setHandlers(handlers: RouterHandlers): this;
	routers: RouterInterface[];
	callbacks: RouterCallback[];
	handlers: HandlerMap;
}

export default class BaseRouter implements RouterInterface {
	private _routers: RouterInterface[] = [];
	private _callbacks: RouterCallback[] = [];
	private _handlers: RouterHandlers = {
		request: [],
		response: [],
	};

	getDefaultResponse(request: Request): Route {
		return {
			method: request.method,
			url: request.url,
			handlers: {
				request: null,
				response: null,
			},
			params: {},
		};
	}

	getRoute(request: Request): Route | null {
		if (this.matches(request)) {
			for (const router of this.routers) {
				const route = router.getRoute(request);
				if (route) {
					return route;
				}
			}
		}

		return null;
	}

	addRequestHandler(handler: Handler): this {
		this._handlers.request.push(handler);

		return this;
	}

	addResponseHandler(handler: Handler): this {
		this._handlers.response.push(handler);

		return this;
	}

	setHandlers(handlers: RouterHandlers): this {
		this._handlers = handlers;

		return this;
	}

	addRouter(router: RouterInterface): this {
		this._routers.push(router);

		return this;
	}

	addCallback(fn: RouterCallback): this {
		this.callbacks.push(fn);

		return this;
	}

	matches(_request: Request): boolean {
		return false;
	}

	get routers(): RouterInterface[] {
		return this._routers;
	}

	get callbacks(): RouterCallback[] {
		return this._callbacks;
	}

	get handlers(): RouterHandlers {
		return this._handlers;
	}
}
