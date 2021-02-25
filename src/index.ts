export * from './conditions/index.js';
export * from './logic/index.js';
export * from './handlers/index.js';
export * from './utils.js';

// Heavy lifting.
import Router from './Router.js';
import RequestManager from './RequestManager.js';

// The prestige.
export function handleFetch(options: any = {}) {
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

export { Router, RequestManager };

export default handleFetch;
