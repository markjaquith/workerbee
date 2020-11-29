import { STRIP_PARAMS } from '../config';

/**
 * Fetch and log a request
 * @param {Request} request
 */
export default async function stripParams(request) {
	const url = new URL(request.url);

	const strippableParams = getStrippableParams(url);

	for (const param in strippableParams) {
		if (url.searchParams.has(param)) {
			console.log('✂️ Remove param', param);
			url.searchParams.delete(param);
		}
	}

	return new Request(url, request);
}

export function getStrippableParams(url) {
	const strippableParams = {};

	for (const param of STRIP_PARAMS) {
		if (url.searchParams.has(param)) {
			strippableParams[param] = url.searchParams.get(param);
		}
	}

	return strippableParams;
}
