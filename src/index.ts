export * from './logic/index';
export * from './handlers/index';
export * from './utils';

// Heavy lifting.
import Router from './Router';
import RequestManager from './RequestManager';
export { Router, RequestManager };

// Make conditions act on current phase, curried.
import { curryWithCurrent, curryWithRequest, curryWithResponse } from './utils';
import * as conditions from './conditions';

const [header] = [conditions.header].map(curryWithCurrent);

const [param, hasParam, routeParam, hasRouteParam] = [
	conditions.param,
	conditions.hasParam,
	conditions.routeParam,
	conditions.hasRouteParam,
].map(curryWithRequest);

const [contentType, isHtml] = [conditions.contentType, conditions.isHtml].map(
	curryWithResponse,
);

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
