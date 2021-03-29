import { ManagerData } from '../RequestManager';
import type { Headers } from './setResponseHeaders';

export default function appendResponseHeaders(headers: Headers = []) {
	return async function ({ request }: ManagerData) {
		let newRequest: Request | null = null;

		if (!Array.isArray(headers)) {
			headers = Object.entries(headers);
		}

		for (const [key, value] of headers) {
			const values = request.headers.get(key) as string;
			const includesValueAlready =
				values &&
				values
					.split(',')
					.map((v) => v.trim())
					.includes(value);
			if (!values || !includesValueAlready) {
				newRequest = newRequest || new Request(request);
				newRequest.headers.append(key, value);
			}
		}

		if (newRequest) {
			return newRequest;
		}
	};
}
