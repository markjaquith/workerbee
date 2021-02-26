export * from './conditions/index';
export * from './logic/index';
export * from './handlers/index';
export * from './utils';

// Heavy lifting.
import Router from './Router';
import RequestManager from './RequestManager';

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
