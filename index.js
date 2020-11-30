export * from './src';
import RequestManager from './src/RequestManager';

export function handleFetch(
	requestHandlers = [],
	responseHandlers = []
) {
	addEventListener('fetch', event => {
		event.passThroughOnException();
		const responder = new RequestManager(requestHandlers, responseHandlers);
		event.respondWith(responder.makeResponse(event.request));
	});
}

export default handleFetch;
