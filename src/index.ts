export * from './logic'
export * from './handlers'
export * from './utils'

// Heavy lifting.
import Text from './Text'
import Router from './Router'
import RequestManager from './RequestManager'
export { Router, RequestManager }

// Make conditions act on current phase, curried.
import { curryWithCurrent, curryWithRequest, curryWithResponse } from './utils'
import * as conditions from './conditions'

const [header] = [conditions.header].map(curryWithCurrent)

const [param, hasParam, routeParam, hasRouteParam] = [
	conditions.param,
	conditions.hasParam,
	conditions.routeParam,
	conditions.hasRouteParam,
].map(curryWithRequest)

const [contentType, isHtml] = [conditions.contentType, conditions.isHtml].map(
	curryWithResponse,
)

export {
	header,
	contentType,
	isHtml,
	hasParam,
	hasRouteParam,
	routeParam,
	param,
}

// Text helper.
export function text(input: string) {
	return Text.from(input)
}

// The prestige.
export function handleFetch(options: any = {}) {
	options = {
		onError: null, // Not currently implemented.
		passThroughOnException: true,
		...options,
	}

	const makeResponse = async (event: FetchEvent) => {
		if (options.passThroughOnException) {
			event.passThroughOnException()
		}

		const responder = new RequestManager(options)

		return await responder.makeResponse(event)
	}

	const listener = (event) => {
		event.respondWith(makeResponse(event))
	}

	addEventListener('fetch', listener)

	return listener
}

export default handleFetch
