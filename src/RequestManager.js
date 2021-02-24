import { Router } from '.';
import { toArray, isRedirect, testing, isResponse, isRequest } from './utils';

export default class RequestManager {
	constructor(options = {}) {
		options = {
			request: [],
			response: [],
			routes: null,
			...options,
		};

		this.routes = options.routes;
		this.originalRequestHandlers = toArray(options.request);
		this.originalResponseHandlers = toArray(options.response);
		this.makeResponse = this.makeResponse.bind(this);
		this.addRequestHandler = this.addRequestHandler.bind(this);
		this.addResponseHandler = this.addResponseHandler.bind(this);
	}

	addRequestHandler(handler, options = { immediate: false }) {
		if (options.immediate) {
			this.requestHandlers.unshift(handler);
		} else {
			this.requestHandlers.push(handler);
		}
	}

	addResponseHandler(handler, options = { immediate: false }) {
		if (options.immediate) {
			this.responseHandlers.unshift(handler);
		} else {
			this.responseHandlers.push(handler);
		}
	}

	log(...args) {
		if (!testing()) {
			console.log(...args);
		}
	}

	group(...args) {
		if (!testing()) {
			console.group(...args);
		}
	}

	groupEnd(...args) {
		if (!testing()) {
			console.groupEnd(...args);
		}
	}

	async getFinalRequest({ request, params }) {
		const originalRequest = request;

		// Response starts null.
		let response = null;

		// Loop through request handlers.
		while (this.requestHandlers.length > 0 && !response) {
			const requestHandler = this.requestHandlers.shift();
			const result = await requestHandler({
				handlers: this,
				request,
				response,
				originalRequest,
				params,
				phase: 'request',
			});

			if (isResponse(result)) {
				// Request handlers can bail early and return a response.
				// This skips the rest of the response handlers.
				response = result;

				if (isRedirect(response)) {
					this.log(
						`⏪ ${response.status}`,
						response.headers.get('location'),
						response
					);
				} else {
					this.log('⏪', response);
				}
				break;
			} else if (isRequest(result)) {
				// A new Request was returned.
				if (result.url !== request.url) {
					// The request URL changed.
					this.log('✏️', result.url, result);
				}

				// We have a new request to pass to the next handler.
				request = result;
			}
		}

		return [request, response];
	}

	async fetch(request) {
		this.log('➡️', request.url);
		const response = await fetch(request);
		this.log('⬅️', response);
		return response;
	}

	async getFinalResponse({ request, response, originalRequest, params }) {
		// If there are response handlers, loop through them.
		while (this.responseHandlers.length > 0) {
			const responseHandler = this.responseHandlers.shift();
			const result = await responseHandler({
				handlers: this,
				request,
				response,
				originalRequest,
				phase: 'response',
				params,
			});

			// If we receive a result, replace the response.
			if (isResponse(result)) {
				response = result;
			}
		}

		return response;
	}

	async makeResponse(event) {
		const { request } = event;

		this.group(request.url);
		this.log('🎬', request);

		// Determine the route.
		let routeRequestHandlers = [];
		let routeResponseHandlers = [];
		let params = {};

		if (this.routes) {
			const router = new Router();
			this.routes(router);
			const route = router.getRoute(request);
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
		const originalRequest = event.request;

		const [finalRequest, earlyResponse] = await this.getFinalRequest({
			request,
			originalRequest,
			params,
		});
		const response = earlyResponse || (await this.fetch(finalRequest));
		const finalResponse = await this.getFinalResponse({
			response,
			request,
			originalRequest,
			params,
		});

		if (isRedirect(finalResponse)) {
			this.log(
				`⤴️ ${finalResponse.status}`,
				finalResponse.headers.get('location') || '',
				finalResponse
			);
		} else {
			this.log('✅', finalResponse);
		}

		this.groupEnd();

		return finalResponse;
	}
}
