export default function removeResponseHeaders(headers = []) {
	return async function ({ response }) {
		const newResponse = new Response(
			response.body,
			response
		);

		for (let header of headers) {
			newResponse.headers.delete(header);
		}

		if (newResponse.headers.length !== response.headers.length) {
			return newResponse;
		}
	}
}
