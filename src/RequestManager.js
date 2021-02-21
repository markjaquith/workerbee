import { toArray, isRedirect } from './utils';

export default class RequestManager {
	constructor(requestHandlers = [], responseHandlers = []) {
		this.originalRequestHandlers = toArray(requestHandlers);
		this.originalResponseHandlers = toArray(responseHandlers);
		this.requestHandlers = [];
		this.responseHandlers = [];
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
		// Reset things for this request, because this object can be long-lived on Cloudflare!
		delete this.response;
		this.requestHandlers = [...this.originalRequestHandlers];
		this.responseHandlers = [...this.originalResponseHandlers];
		this.originalRequest = request;
		this.phase = 'request';

		// Request starts out as the original request.
		this.request = request;

		// Loop through request handlers.
		while (this.requestHandlers.length > 0 && !this.response) {
			const requestHandler = this.requestHandlers.shift();
			const result = await requestHandler(this);

			if (result instanceof Response) {
				// Request handlers can bail early and return a response.
				// This skips the rest of the response handlers.
				this.response = result;

				if (isRedirect(this.response)) {
					this.log(
						`⏪ ${this.response.status}`,
						this.response.headers.get('location'),
						this.response
					);
				} else {
					this.log('⏪', this.response);
				}
				return this.response;
			} else if (result instanceof Request) {
				// A new Request was returned.
				if (result.url !== this.request.url) {
					// The request URL changed.
					this.log('✏️', result.url, result);
				}

				this.request = result;
			}
		}

		return this.request;
	}

	async maybeFetch() {
		if (!this.response) {
			this.phase = 'fetch';
			// If we don't already have a response, we should fetch the request.
			this.log('➡️', this.request.url);
			this.response = await fetch(this.request);
			this.log('⬅️', this.response);
		}

		return this.response;
	}

	async getFinalResponse() {
		this.phase = 'response';

		// If there are response handlers, loop through them.
		while (this.responseHandlers.length > 0) {
			const responseHandler = this.responseHandlers.shift();
			const result = await responseHandler(this);

			// If we receive a result, replace the response.
			if (result instanceof Response) {
				this.response = result;
			}
		}

		if (isRedirect(this.response)) {
			this.log(
				`⤴️ ${this.response.status}`,
				this.response.headers.get('location') || '',
				this.response
			);
		} else {
			this.log('✅', this.response);
		}

		return this.response;
	}

	async makeResponse(event) {
		const { request } = event;
		this.group(request.url);
		this.log('🎬', request);

		await this.getFinalRequest(event);
		await this.maybeFetch();
		const finalResponse = await this.getFinalResponse();

		this.groupEnd();

		return finalResponse;
	}
}
