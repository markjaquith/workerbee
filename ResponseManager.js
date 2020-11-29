import { toArray } from './utils';

export default class RequestManager {
	constructor(requestHandlers = [], responseHandlers = []) {
		this.requestHandlers = toArray(requestHandlers);
		this.responseHandlers = toArray(responseHandlers);
	}

	addRequestHandler(handler) {
		this.requestHandlers.push(handler);
	}

	addResponseHandler(handler) {
		this.responseHandlers.push(handler);
	}

	async handleFetch() {
		addEventListener('fetch', (event) => {
			event.passThroughOnException();
	
			async function makeResponse(originalRequest) {
				this.originalRequest = originalRequest;

				console.group(originalRequest.url);
				console.log('🎬', originalRequest);
	
				// Request starts out as the original request.
				this.request = originalRequest.clone();
	
				// Loop through request handlers.
				try {
					while(this.requestHandlers.length > 0) {
						const requestHandler = requestHandlers.shift();
						let result = await requestHandler(this.request);

						// If we don't get back a result, the handler declined to do anything.
						if (!result) {
							continue;
						} else if (result instanceof Response) {
							// Request handlers can bail early and return a response.
							// This skips the rest of the response handlers.
							throw result;
						} else if (result instanceof Request) {
							// The handler returned a new Request object.
							this.request = result;

							// Log that the request URL changed.
							if (result.url !== request.url) {
								console.log('✏️', request.url, request);
							}
						}
					}
				} catch (result) {
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
				}

				// If we don't already have a response, we should fetch the request.
				if (!this.response) {
					// Fetch.
					console.log('➡️', this.request.url);
					this.response = await fetch(this.request);
					console.log('⬅️', this.response);
				}
	
				// If there are response handlers, loop through them.
				while (this.responseHandlers.length > 0) {
					const responseHandler = this.responseHandlers.shift();
					const result = await responseHandler(this.response, this.request, this.originalRequest);

					// If we don't get back a result, the handler declined to do anything.
					if (!result) {
						continue;
					} else if (result instanceof Response) {
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
	
			event.respondWith(makeResponse(event.request));
		});
	}
}
