import { STRIP_PARAMS } from '../config';
import { setRequestUrl, isRedirect } from './utils';

/**
 * Fetch and log a request
 * @param {Request} request
 */
export default function stripParams(params = STRIP_PARAMS) {
	return async ({ request, addResponseHandler }) => {
		const url = new URL(request.url);

		const strippableParams = getStrippableParams(url, params);

		for (const param in strippableParams) {
			if (url.searchParams.has(param)) {
				console.log('✂️ Remove param', param);
				url.searchParams.delete(param);
			}
		}

		// We changed the URL.
		if (url.toString() !== request.url) {
			addResponseHandler(restoreStrippedParamsOnRedirect(strippableParams));
			return setRequestUrl(url, request);
		}
	};
}

function getStrippableParams(url, params = []) {
	const strippableParams = {};

	for (const param of params) {
		if (url.searchParams.has(param)) {
			strippableParams[param] = url.searchParams.get(param);
		}
	}

	return strippableParams;
}

function restoreStrippedParamsOnRedirect(params = []) {
	return async ({ response }) => {
		if (isRedirect(response)) {
			const redirectLocation = new URL(response.headers.get('location'));
			if (Object.keys(params).length) {
				for (const param in params) {
					console.log('🕊 Restore param', param, params[param]);
					redirectLocation.searchParams.set(param, params[param]);
				}

				const newResponse = new Response(response.body, response);
				newResponse.headers.set('location', redirectLocation.toString());

				return newResponse;
			}
		}
	};
}
