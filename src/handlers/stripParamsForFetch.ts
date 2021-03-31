import { STRIP_PARAMS } from '../config'
import { ManagerData } from '../RequestManager'
import { setRequestUrl, isRedirect } from '../utils'

interface ParamMap {
	[param: string]: string
}

/**
 * Fetch and log a request
 * @param {Request} request
 */
export default function stripParamsForFetch(params: string[] = STRIP_PARAMS) {
	return async ({ request, addResponseHandler, log }: ManagerData) => {
		const url = new URL(request.url)

		const strippableParams = getStrippableParams(url, params)

		for (const param in strippableParams) {
			log('✂️ Remove param', param)
			url.searchParams.delete(param)
		}

		// We changed the URL.
		if (url.toString() !== request.url) {
			addResponseHandler(restoreStrippedParamsOnRedirect(strippableParams))
			return setRequestUrl(url, request)
		}
	}
}

function getStrippableParams(url: URL, params: string[]): ParamMap {
	const strippableParams: ParamMap = {}

	for (const param of params) {
		if (url.searchParams.has(param)) {
			strippableParams[param] = url.searchParams.get(param)!
		}
	}

	return strippableParams
}

function restoreStrippedParamsOnRedirect(params: ParamMap) {
	return async ({ response, log }: ManagerData) => {
		if (isRedirect(response)) {
			const redirectLocation = new URL(response.headers.get('location')!)
			for (const param in params) {
				log('🕊 Restore param', param, params[param])
				redirectLocation.searchParams.set(param, params[param])
			}

			const newResponse = new Response(response.body, response)
			newResponse.headers.set('location', redirectLocation.toString())

			return newResponse
		}
	}
}
