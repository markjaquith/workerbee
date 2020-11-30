export * from './requestHandlers';
export * from './responseHandlers';
import RequestManager from './RequestManager';

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
