import cookie from 'cookie'
import { curry, partial, partialRight } from 'ramda'
import type { ManagerData, Handler } from './RequestManager'
import Text from './Text'

export type ValueMatchingFunction = (value: string) => boolean
export type ValueMatcher =
	| string
	| string[]
	| ValueMatchingFunction
	| ValueMatchingFunction[]

export interface Stringable {
	toString(): string
}

export { partialRight }
export { partial }
export { curry }

type ForcedArray<T> = T extends null | undefined
	? []
	: T extends Array<unknown>
	? T
	: T[]

export function toArray<T>(input?: T): ForcedArray<T> {
	if (null == input) {
		return [] as ForcedArray<T>
	} else if (Array.isArray(input)) {
		return input as ForcedArray<T>
	} else {
		return ([input] as unknown) as ForcedArray<T>
	}
}

/**
 * Whether the given response is a redirect.
 *
 * @param Response A response object.
 * @return boolean
 */
export function isRedirect({ status, headers }: Response) {
	return status >= 300 && status < 400 && headers.has('location')
}

export function setRequestUrl(url: Stringable, request: Request, options = {}) {
	return new Request(url.toString(), {
		...request,
		...options,
	})
}

export function getCookie(request: Request, name: string) {
	const cookies = cookie.parse(request.headers.get('cookie') || '')

	return cookies[name] || null
}

export function testing() {
	return process.env.JEST_WORKER_ID !== undefined
}

export function matchesValue(test: ValueMatcher, value: string) {
	switch (typeof test) {
		case 'function':
			return test(value)
		case 'string':
			return test === value
		default:
			for (const eachTest of test) {
				if (matchesValue(eachTest, value)) {
					return true
				}
			}

			return false
	}
}

export function makeStringMethodMatcher(
	method: 'startsWith' | 'includes' | 'endsWith',
) {
	return curry((searchText: string | Text, value: string) => {
		return Text.from(searchText).matches(value, (searchText, value) =>
			value[method](searchText),
		)
	})
}

type AnyFunc = (...any: any[]) => any
type Transform = (any: any) => any

// Runs a transformation on the last argument passed to the underlying function.
export function transformLastArgument<F extends AnyFunc>(
	transform: Transform,
	fn: F,
): AnyFunc {
	switch (fn.length) {
		case 0:
			return fn
		case 1:
			return (z: any) => fn(transform(z))
		case 2:
			return (a: any, z: any) => fn(a, transform(z))
		case 3:
			return (a: any, b: any, z: any) => fn(a, b, transform(z))
		case 4:
			return (a: any, b: any, c: any, z: any) => fn(a, b, c, transform(z))
		case 5:
			return (a: any, b: any, c: any, d: any, z: any) =>
				fn(a, b, c, d, transform(z))
		default:
			throw `transformLastArgument only accepts functions with between 0 and 5 arguments. Your function had ${fn.length}`
	}
}

export interface HandlerInput {
	current: Request | Response
	request: Request
	response: Response
}

export type Condition = (manager: ManagerData) => boolean

// Passes the current property of the last passed argument to the underlying function.
export function withCurrent<F extends Condition>(fn: F): F {
	return transformLastArgument((p: HandlerInput) => p.current, fn) as F
}

export function withResponse<F extends Condition>(fn: F): F {
	return transformLastArgument((p: HandlerInput) => p.response, fn) as F
}

export function withRequest<F extends Condition>(fn: F): F {
	return transformLastArgument((p: HandlerInput) => p.request, fn) as F
}

// Curries the function after ensuring that its last passed argument digs into the current property.
export function curryWithCurrent(fn: (...any: any[]) => any) {
	return curry(withCurrent(fn))
}

export function curryWithRequest(fn: (...any: any[]) => any) {
	return curry(withRequest(fn))
}

export function curryWithResponse(fn: (...any: any[]) => any) {
	return curry(withResponse(fn))
}

export function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function delayUntilResponsePhase(handler: Handler) {
	return async function (manager: ManagerData) {
		if ('response' === manager.phase) {
			return handler(manager)
		}

		manager.addResponseHandler(handler, { immediate: true })
	}
}
