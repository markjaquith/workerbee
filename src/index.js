import headerContains from './conditions/headerContains';
import pathStartsWith from './conditions/pathStartsWith';
import createConditionals from './createConditionals';
import createRequestConditionals from './createRequestConditionals';

export { default as RequestManager } from './RequestManager';
export { default as forbidden } from './forbidden';
export { default as forceHttps } from './forceHttps';
export { default as requireCookieOrParam } from './requireCookieOrParam';
export { default as stripParamsForFetch } from './stripParamsForFetch';
export { default as setResponseHeaders } from './setResponseHeaders';
export { default as appendResponseHeaders } from './appendResponseHeaders';
export { default as removeResponseHeaders } from './removeResponseHeaders';
export { default as applyHandlersIf } from './applyHandlersIf';
export {
	headerContains,
	pathStartsWith,
	createConditionals,
	createRequestConditionals,
};
export * from './utils';

export const [
	ifRequestHeaderContains,
	unlessRequestHeaderContains,
] = createRequestConditionals(headerContains);
export const [ifPathStartsWith, unlessPathStartsWith] = createConditionals(
	pathStartsWith
);
