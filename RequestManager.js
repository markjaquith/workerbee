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
	}

	addRequestHandler(handler) {
		this.requestHandlers.push(handler);
	}

	addResponseHandler(handler) {
		this.responseHandlers.push(handler);
	}

	async makeResponse(originalRequest) {
		// Reset things for this request, because this object can be long-lived on Cloudflare!
		delete(this.response);
		this.requestHandlers = [...this.originalRequestHandlers];
		this.responseHandlers = [...this.originalResponseHandlers];
		this.originalRequest = originalRequest;

		console.group(originalRequest.url);
		console.log('🎬', originalRequest);

		// Request starts out as the original request.
		this.request = originalRequest;

		// Loop through request handlers.
		while(this.requestHandlers.length > 0 && !this.response) {
			const requestHandler = this.requestHandlers.shift();
			const result = await requestHandler(this);

			if (result instanceof Response) {
				// Request handlers can bail early and return a response.
				// This skips the rest of the response handlers.
				this.response = result;

				if (isRedirect(this.response)) {
					console.log(
						`⏪ ${this.response.status}`,
						this.response.headers.get('location'),
						this.response
					);
				} else {
					console.log('⏪', this.response);
				}
			} else if (result instanceof Request) {
				// A new Request was returned.
				if (result.url !== this.request.url) {
					// The request URL changed.
					console.log('✏️', result.url, result);
				}

				this.request = result;
			}
		}
		
		if (!this.response) {
			// If we don't already have a response, we should fetch the request.
			console.log('➡️', this.request.url);
			this.response = await fetch(this.request);
			console.log('⬅️', this.response);
		}

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
			console.log(
				`⤴️ ${this.response.status}`,
				this.response.headers.get('location') || '',
				this.response
			);
		} else {
			console.log('✅', this.response);
		}

		console.groupEnd();

		return this.response;
	}
}
