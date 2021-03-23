import { ManagerData } from '../RequestManager';

export default function removeResponseHeaders(headers = []) {
	return async function ({ response }: ManagerData) {
		const newResponse = new Response(response.body, response);
		let removedAny = false;

		for (const header of headers) {
			if (newResponse.headers.has(header)) {
				newResponse.headers.delete(header);
				removedAny = true;
			}
		}

		if (removedAny) {
			return newResponse;
		}
	};
}
