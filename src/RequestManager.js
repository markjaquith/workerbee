import { toArray, isRedirect, testing } from './utils';

export default class RequestManager {
	constructor(options = {}) {
		options = Object.assign({
			request: [],
			response: [],
			router: null,
		}, options);

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

	async getFinalRequest({ request }) {
		const originalRequest = request;
		const phase = 'request';

		// Response starts null.
		let response = null;

		// Loop through request handlers.
		while (this.requestHandlers.length > 0 && !this.response) {
			const requestHandler = this.requestHandlers.shift();
			const result = await requestHandler({ ...this, request, response, originalRequest, phase });

			if (result instanceof Response) {
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
			} else if (result instanceof Request) {
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
		this.phase = 'fetch';
		this.log('➡️', request.url);
		const response = await fetch(request);
		this.log('⬅️', response);
		return response;
	}

	async getFinalResponse({ request, response, originalRequest }) {
		const phase = 'response';

		// If there are response handlers, loop through them.
		while (this.responseHandlers.length > 0) {
			const responseHandler = this.responseHandlers.shift();
			const result = await responseHandler({ ...this, request, response, originalRequest, phase });

			// If we receive a result, replace the response.
			if (result instanceof Response) {
				response = result;
			}
		}

		return response;
	}

	async makeResponse(event) {
		const { request } = event;

		// We don't have a response yet, so delete it in case it is left over from another attempt.
		delete this.response;

		this.group(request.url);
		this.log('🎬', request);

		this.requestHandlers = [...this.originalRequestHandlers];
		this.responseHandlers = [...this.originalResponseHandlers];
		const originalRequest = event.requset;

		const [finalRequest, earlyResponse] = await this.getFinalRequest(event);
		const response = earlyResponse || await this.fetch(finalRequest)
		const finalResponse = await this.getFinalResponse({ response, request, originalRequest });

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
