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
		onError: null,
		passThroughOnException: true,
		...options,
	}

	const listener = (event: FetchEvent) => {
		if (options.passThroughOnException) {
			event.passThroughOnException()
		}

		let makeResponse = () => {
			const responder = new RequestManager(options)
			return responder.makeResponse(event)
		}

		if (options.onError) {
			makeResponse = () => {
				try {
					return makeResponse()
				} catch (error) {
					return options.onError(error)
				}
			}
		}

		const response = makeResponse()

		event.respondWith(response)

		return response
	}

	addEventListener('fetch', listener)

	return listener
}

export default handleFetch
