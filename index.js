export * from './requestHandlers';
export * from './responseHandlers';
import ResponseManager from './ResponseManager';

export function handleFetch(
	requestHandlers = [],
	responseHandlers = []
) {
	addEventListener('fetch', event => {
		event.passThroughOnException();
		const responder = new ResponseManager(requestHandlers, responseHandlers);
		event.respondWith(responder.makeResponse(event.request));
	});
}

export default handleFetch;
