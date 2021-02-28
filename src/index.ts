export * from './logic/index';
export * from './handlers/index';
export * from './utils';

// Heavy lifting.
import Router from './Router';
import RequestManager from './RequestManager';
export { Router, RequestManager };

// Make conditions act on current phase, curried.
import { curryWithCurrent } from './utils';
import * as conditions from './conditions/index';

const [
	header,
	contentType,
	isHtml,
	hasParam,
	hasRouteParam,
	routeParam,
	param,
] = [
	conditions.header,
	conditions.contentType,
	conditions.isHtml,
	conditions.hasParam,
	conditions.hasRouteParam,
	conditions.routeParam,
	conditions.param,
].map(curryWithCurrent);

export {
	header,
	contentType,
	isHtml,
	hasParam,
	hasRouteParam,
	routeParam,
	param,
};

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

export default handleFetch;
