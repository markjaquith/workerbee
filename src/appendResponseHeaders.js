export default function appendResponseHeaders(headers = []) {
	return async function ({ response }) {
		const newResponse = new Response(
			response.body,
			response
		);
		let changed = false;

		for (const [key, value] of headers) {
			if (newResponse.headers.get(key) !== value) {
				newResponse.headers.append(key, value);
				changed = true;
			}
		}

		if (changed) {
			return newResponse;
		}
	}
}
