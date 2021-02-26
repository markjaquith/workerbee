export default function copyResponseHeader(from, to) {
	return async function ({ response }) {
		const { headers } = response;

		if (headers.has(from)) {
			const newResponse = new Response(response.body, response);
			newResponse.headers.set(to, headers.get(from));
			return newResponse;
		}
	};
}
