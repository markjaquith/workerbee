import cookie from 'cookie';

import type { Handler } from './RequestManager';
import Text from './Text';
export interface IncompleteFunction {
	(): Handler;
	incomplete: true;
}

export type ValueMatchingFunction = (value: string) => boolean;
export type ValueMatcher =
	| string
	| string[]
	| ValueMatchingFunction
	| ValueMatchingFunction[];

export const curry = (fn) => {
	const expectedArgs = fn.length;
	const curried = (...args) => {
		return args.length >= expectedArgs
			? fn(...args)
			: (...args2) => curried(...args.concat(args2));
	};
	return curried;
};

export const partial = (fn, ...leftArgs) => (...args) =>
	fn(...leftArgs, ...args);
export const partialRight = (fn, ...rightArgs) => (...args) =>
	fn(...args, ...rightArgs);

export function toArray(mixed) {
	if (null === mixed || undefined === mixed) {
		return [];
	}

	return Array.isArray(mixed) ? mixed : [mixed];
}

/**
 * Whether the given response is a redirect.
 *
 * @param Response A response object.
 * @return boolean
 */
export function isRedirect({ status, headers }: Response) {
	return status >= 300 && status < 400 && headers.get('location');
}

export function setRequestUrl(url, request, options = {}) {
	return new Request(url, {
		...request,
		...options,
	});
}

/**
 * Gets the cookie with the name from the request headers
 *
 * @param {Request} request incoming Request
 * @param {string} name of the cookie to get
 */
export function getCookie(request, name) {
	const cookies = cookie.parse(request.headers.get('cookie') || '');

	return cookies[name] || null;
}

export function testing() {
	return process.env.JEST_WORKER_ID !== undefined;
}

export function matchesValue(test: ValueMatcher, value: string) {
	switch (typeof test) {
		case 'function':
			return test(value);
		case 'string':
			return test === value;
		default:
			for (const eachTest of test) {
				if (matchesValue(eachTest, value)) {
					return true;
				}
			}

			return false;
	}
}

export function makeStringMethodMatcher(method: string) {
	return curry((searchText: string | Text, value: string) => {
		return Text.from(searchText).matches(value, (searchText, value) =>
			value[method](searchText),
		);
	});
}

export function incomplete(fn) {
	fn.incomplete = true;
	return fn;
}

export function isIncomplete(fn): fn is IncompleteFunction {
	return fn?.incomplete === true;
}

export function makeComplete(fn) {
	while (isIncomplete(fn)) {
		fn = fn();
	}

	return fn;
}

export function test(input: string): string;
export function test(input: number): number;
export function test(input: number | string): number | string {
	return input;
}

// Runs a transformation on the last argument passed to the underlying function.
export function transformLastArgument(
	transform: (any) => any,
	fn: (a?: any, b?: any, c?: any, d?: any, z?: any) => any,
) {
	switch (fn.length) {
		case 0:
			return fn;
		case 1:
			return (z) => fn(transform(z));
		case 2:
			return (a, z) => fn(a, transform(z));
		case 3:
			return (a, b, z) => fn(a, b, transform(z));
		case 4:
			return (a, b, c, z) => fn(a, b, c, transform(z));
		case 5:
			return (a, b, c, d, z) => fn(a, b, c, d, transform(z));
		default:
			throw `transformLastArgument only accepts functions with between 0 and 5 arguments. Your function had ${fn.length}`;
	}
}

// Passes the current property of the last passed argument to the underlying function.
export function withCurrent(fn) {
	return transformLastArgument((p) => p.current, fn);
}

export function withResponse(fn) {
	return transformLastArgument((p) => p.response, fn);
}

export function withRequest(fn) {
	return transformLastArgument((p) => p.request, fn);
}

// Curries the function after ensuring that its last passed argument digs into the current property.
export function curryWithCurrent(fn) {
	return curry(withCurrent(makeComplete(fn)));
}

export function curryWithRequest(fn) {
	return curry(withRequest(makeComplete(fn)));
}

export function curryWithResponse(fn) {
	return curry(withResponse(makeComplete(fn)));
}
