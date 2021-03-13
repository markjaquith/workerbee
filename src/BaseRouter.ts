import { Handlers } from './RequestManager';

type RouterCallback = (RouterInterface) => void;

export interface Params {
	[key: string]: string;
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

export interface RouterInterface {
	getRoute(request: Request): Route | null;
	addRouter(router: RouterInterface): void;
	addCallback(RouterCallback): void;
	matches(request: Request): boolean;
	routers: RouterInterface[];
	callbacks: RouterCallback[];
}

export default class BaseRouter implements RouterInterface {
	private _routers: RouterInterface[] = [];
	private _callbacks: RouterCallback[] = [];

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
}
