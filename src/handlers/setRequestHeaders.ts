export type Header = [key: string, value: string];
export interface HeaderMap {
	[header: string]: string;
}
export type Headers = Header[] | HeaderMap;

export default function setResponseHeaders(headers: Headers = []) {
	return async function ({ request }) {
		const newRequest = new Request(request);
		let changed = false;

		if (!Array.isArray(headers)) {
			headers = Object.entries(headers);
		}

		for (const [key, value] of headers) {
			if (newRequest.headers.get(key) !== value) {
				newRequest.headers.set(key, value);
				changed = true;
			}
		}

		if (changed) {
			return newRequest;
		}
	};
}
