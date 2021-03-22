import { Router } from './Router';
import { toArray, isRedirect, testing } from './utils';

import type { Params } from './Router';

export type HandlerResult = void | Request | Response;
export type Handler = (
	manager: HandlerProcessor,
) => void | Promise<HandlerResult>;
export type Handlers = Handler | Handler[];
export type RouterCallback = (router: Router) => void;

interface FinalRequestOptions {
	request: Request;
	params: Params;
}

interface FinalResponseOptions {
	request: Request;
	response: Response;
	originalRequest: Request;
	params: Params;
}

export interface Options {
	request?: Handlers;
	response?: Handlers;
	routes?: RouterCallback;
}

export interface AddHandlerOptions {
	immediate?: boolean;
}

type HandlerAdder = (handler: Handler, options?: AddHandlerOptions) => void;

export interface HandlerProcessor {
	addRequestHandler: HandlerAdder;
	addResponseHandler: HandlerAdder;
	request: Request;
	current: Request | Response;
	response: Response;
	originalRequest: Request;
	params: Params;
	phase: string;
}

export default class RequestManager {
	private requestHandlers: Handler[] = [];
	private responseHandlers: Handler[] = [];
	private originalRequestHandlers: Handler[];
	private originalResponseHandlers: Handler[];
	private routes: RouterCallback | undefined;
	public testing = testing();

	constructor(options: Options = {}) {
		options = {
			request: [],
			response: [],
			...options,
		};

		this.routes = options.routes;
		this.originalRequestHandlers = toArray(options.request);
		this.originalResponseHandlers = toArray(options.response);
		this.makeResponse = this.makeResponse.bind(this);
		this.addRequestHandler = this.addRequestHandler.bind(this);
		this.addResponseHandler = this.addResponseHandler.bind(this);
	}

	addRequestHandler(
		handler: Handler,
		options: AddHandlerOptions = { immediate: false },
	) {
		if (options.immediate) {
			this.requestHandlers.unshift(handler);
		} else {
			this.requestHandlers.push(handler);
		}
	}

	addResponseHandler(
		handler: Handler,
		options: AddHandlerOptions = { immediate: false },
	) {
		if (options.immediate) {
			this.responseHandlers.unshift(handler);
		} else {
			this.responseHandlers.push(handler);
		}
	}

	log(message?: any, ...optionalParams: any[]) {
		if (!this.testing) {
			console.log(message, ...optionalParams);
		}
	}

	error(message?: any, ...optionalParams: any[]) {
		console.error(message, ...optionalParams);
	}

	group(...label: any[]) {
		if (!this.testing) {
			console.group(...label);
		}
	}

	groupEnd() {
		if (!this.testing) {
			console.groupEnd();
		}
	}

	async getFinalRequest({
		request,
		params,
	}: FinalRequestOptions): Promise<[Request, Response | null]> {
		const originalRequest = request;

		// Response starts null.
		let response: Response | null = null;
		const dummyResponse = new Response();

		// Loop through request handlers.
		while (this.requestHandlers.length > 0 && !response) {
			let requestHandler = this.requestHandlers.shift();

			if (!requestHandler) {
				continue;
			}

			const result = await requestHandler({
				addRequestHandler: this.addRequestHandler,
				addResponseHandler: this.addResponseHandler,
				request,
				current: request,
				response: response ?? dummyResponse,
				originalRequest,
				params,
				phase: 'request',
			});

			if (result instanceof Response) {
				// Request handlers can bail early and return a response.
				// This skips the rest of the response handlers.
				response = result;

				if (isRedirect(response)) {
					this.log(
						`⏪ ${response.status}`,
						response.headers.get('location'),
						response,
					);
				} else {
					this.log('⏪', response);
				}
				break;
			} else if (result instanceof Request) {
				// A new Request was returned.
				if (result.url !== request.url) {
					// The request URL changed.
					this.log('✏️', result.url, result);
				}

				// We have a new request to pass to the next handler.
				request = result;
			} else if (typeof result !== 'undefined') {
				this.error(
					'Your handler returned something other than a Request, a Response, or undefined',
					result,
				);
			}
		}

		return [request, response];
	}

	async fetch(request: Request) {
		this.log('➡️', request.url);
		const response = await fetch(request);
		this.log('⬅️', response);
		return response;
	}

	async getFinalResponse({
		request,
		response,
		originalRequest,
		params,
	}: FinalResponseOptions) {
		// If there are response handlers, loop through them.
		while (this.responseHandlers.length > 0) {
			const responseHandler = this.responseHandlers.shift();

			if (!responseHandler) {
				continue;
			}

			const result = await responseHandler({
				addRequestHandler: this.addRequestHandler,
				addResponseHandler: this.addResponseHandler,
				request,
				response,
				current: response,
				originalRequest,
				phase: 'response',
				params,
			});

			// If we receive a result, replace the response.
			if (result instanceof Response) {
				response = result;
			} else if (result instanceof Request) {
				this.error(
					'Unexpectedly received a Request back from a Response handler',
					result,
				);
			}
		}

		return response;
	}

	async makeResponse(event: FetchEvent) {
		const { request } = event;

		this.group(request.url);
		this.log('🎬', request);

		// Determine the route.
		let routeRequestHandlers: Handler[] = [];
		let routeResponseHandlers: Handler[] = [];
		let params = {};

		if (this.routes) {
			const router = new Router();
			this.routes(router);
			const route = router.getRoute(request) || router.getNullRoute(request);
			routeRequestHandlers = toArray(route.handlers.request);
			routeResponseHandlers = toArray(route.handlers.response);
			params = route.params;
		}

		this.requestHandlers = [
			...this.originalRequestHandlers,
			...routeRequestHandlers,
		];
		this.responseHandlers = [
			...this.originalResponseHandlers,
			...routeResponseHandlers,
		];
		const originalRequest = request;

		const [finalRequest, earlyResponse] = await this.getFinalRequest({
			request,
			params,
		});
		const response = earlyResponse ?? (await this.fetch(finalRequest));
		const finalResponse = await this.getFinalResponse({
			response,
			request,
			originalRequest,
			params,
		});

		if (isRedirect(finalResponse)) {
			this.log(
				`⤴️ ${finalResponse.status}`,
				finalResponse.headers.get('location'),
				finalResponse,
			);
		} else {
			this.log('✅', finalResponse);
		}

		this.groupEnd();

		return finalResponse;
	}
}
