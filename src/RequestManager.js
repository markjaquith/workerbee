import { toArray, isRedirect } from './utils';

export default class RequestManager {
	constructor(requestHandlers = [], responseHandlers = []) {
		this.originalRequestHandlers = toArray(requestHandlers);
		this.originalResponseHandlers = toArray(responseHandlers);
		this.makeResponse = this.makeResponse.bind(this);
		this.addRequestHandler = this.addRequestHandler.bind(this);
		this.addResponseHandler = this.addResponseHandler.bind(this);
		this.addImmediateRequestHandler = this.addImmediateRequestHandler.bind(
			this
		);
		this.addImmediateResponseHandler = this.addImmediateResponseHandler.bind(
			this
		);
	}

	addImmediateRequestHandler(handler) {
		this.requestHandlers.unshift(handler);
	}

	addImmediateResponseHandler(handler) {
		this.responseHandlers.unshift(handler);
	}

	addRequestHandler(handler) {
		this.requestHandlers.push(handler);
	}

	addResponseHandler(handler) {
		this.responseHandlers.push(handler);
	}

	testing() {
		return process.env.JEST_WORKER_ID !== undefined;
	}
	
	log(...args) {
		if (!this.testing()) {
			console.log(...args);
		}
	}

	group(...args) {
		if (!this.testing()) {
			console.group(...args);
		}
	}

	groupEnd(...args) {
		if (!this.testing()) {
			console.groupEnd(...args);
		}
	}

	async getFinalRequest({ request }) {
		this.originalRequest = request;
		this.phase = 'request';

		// Request starts out as the original request.
		this.request = request;

		// Response starts null.
		let response = null;

		// Loop through request handlers.
		while (this.requestHandlers.length > 0 && !this.response) {
			const requestHandler = this.requestHandlers.shift();
			const result = await requestHandler(this);

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
				if (result.url !== this.request.url) {
					// The request URL changed.
					this.log('✏️', result.url, result);
				}

				this.request = result;
			}
		}

		return [this.request, response];
	}

	async fetch(request) {
		this.phase = 'fetch';
		this.log('➡️', request.url);
		const response = await fetch(request);
		this.log('⬅️', response);
		return response;
	}

	async getFinalResponse(response) {
		this.phase = 'response';
		this.response = response;

		// If there are response handlers, loop through them.
		while (this.responseHandlers.length > 0) {
			const responseHandler = this.responseHandlers.shift();
			const result = await responseHandler(this);

			// If we receive a result, replace the response.
			if (result instanceof Response) {
				this.response = result;
			}
		}

		return this.response;
	}

	async makeResponse(event) {
		const { request } = event;

		// We don't have a response yet, so delete it in case it is left over from another attempt.
		delete this.response;

		this.group(request.url);
		this.log('🎬', request);

		this.requestHandlers = [...this.originalRequestHandlers];
		this.responseHandlers = [...this.originalResponseHandlers];

		const [finalRequest, earlyResponse] = await this.getFinalRequest(event);
		const initialResponse = earlyResponse || await this.fetch(finalRequest)
		const finalResponse = await this.getFinalResponse(initialResponse);

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
