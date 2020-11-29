import { getStrippableParams } from '../requestHandlers/stripParams';
import { isRedirect } from '../utils';

export default async function restoreStrippedParamsOnRedirect(
	response,
	_request,
	originalRequest
) {
	if (isRedirect(response)) {
		const redirectLocation = new URL(response.headers.get('location'));
		const strippedParams = getStrippableParams(new URL(originalRequest.url));
		if (Object.keys(strippedParams).length) {
			for (const param in strippedParams) {
				console.log('🕊 Restore param', param, strippedParams[param]);
				redirectLocation.searchParams.set(param, strippedParams[param]);
			}

			const newResponse = new Response(response.body, response);
			newResponse.headers.set('location', redirectLocation.toString());

			return newResponse;
		}
	}
}
