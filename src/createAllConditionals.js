import createRequestConditionals from './createRequestConditionals';
import createResponseConditionals from './createResponseConditionals';

export default (fn) => [
	...createRequestConditionals(fn),
	...createResponseConditionals(fn),
];
