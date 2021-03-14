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
	addRouter(router: RouterInterface): void;
	addResponseHandler(handler: Handler): void;
	addRequestHandler(handler: Handler): void;
	addCallback(RouterCallback): void;
	matches(request: Request): boolean;
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

	addRequestHandler(handler: Handler): void {
		this._handlers.request.push(handler);
	}

	addResponseHandler(handler: Handler): void {
		this._handlers.response.push(handler);
	}

	addRouter(router: RouterInterface): void {
		this._routers.push(router);
	}

	addCallback(fn: RouterCallback) {
		this.callbacks.push(fn);
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
