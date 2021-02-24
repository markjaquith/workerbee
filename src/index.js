import headerContains from './conditions/headerContains';
import createConditionals from './createConditionals';
import createRequestConditionals from './createRequestConditionals';
import RequestManager from './RequestManager';

export { default as forbidden } from './forbidden';
export { default as forceHttps } from './forceHttps';
export { default as requireCookieOrParam } from './requireCookieOrParam';
export { default as stripParamsForFetch } from './stripParamsForFetch';
export { default as setResponseHeaders } from './setResponseHeaders';
export { default as appendResponseHeaders } from './appendResponseHeaders';
export { default as removeResponseHeaders } from './removeResponseHeaders';
export { default as applyHandlersIf } from './applyHandlersIf';
export { default as lazyLoadImages } from './lazyLoadImages';
export { default as Router } from './Router';
export {
	headerContains,
	createConditionals,
	createRequestConditionals,
};
export * from './utils';

export const [
	ifRequestHeaderContains,
	unlessRequestHeaderContains,
] = createRequestConditionals(headerContains);

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
