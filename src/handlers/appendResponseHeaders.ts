import type { Headers } from './setResponseHeaders';

export default function appendResponseHeaders(headers: Headers = []) {
	return async function ({ response }) {
		let newResponse;

		if (!Array.isArray(headers)) {
			headers = Object.entries(headers);
		}

		for (const [key, value] of headers) {
			if (response.headers.get(key) !== value) {
				newResponse = newResponse || new Response(response.body, response);
				newResponse.headers.append(key, value);
			}
		}

		if (newResponse) {
			return newResponse;
		}
	};
}
