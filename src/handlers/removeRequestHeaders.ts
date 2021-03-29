import { ManagerData } from '../RequestManager';

export default function removeRequestHeaders(headers = []) {
	return async function ({ request }: ManagerData) {
		const newRequest = new Request(request);
		let removedAny = false;

		for (const header of headers) {
			if (newRequest.headers.has(header)) {
				newRequest.headers.delete(header);
				removedAny = true;
			}
		}

		if (removedAny) {
			return newRequest;
		}
	};
}
