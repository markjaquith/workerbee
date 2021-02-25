export * from './conditions';
export * from './logic';
export * from './handlers';
export * from './utils';

// Heavy lifting.
export { default as Router } from './Router';
import RequestManager from './RequestManager';
export { RequestManager };

// The prestige.
export function handleFetch(options = {}) {
	options = {
		passThroughOnException: true,
		...options,
	};

	addEventListener('fetch', (event) => {
		if (options.passThroughOnException) {
			event.passThroughOnException();
		}

		const responder = new RequestManager(options);
		event.respondWith(responder.makeResponse(event));
	});
}

export default handleFetch;
