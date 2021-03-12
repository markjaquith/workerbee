export type Header = [key: string, value: string];
export interface HeaderMap {
	[header: string]: string;
}
export type Headers = Header[] | HeaderMap;

export default function setResponseHeaders(headers: Headers = []) {
	return async function ({ response }) {
		const newResponse = new Response(response.body, response);
		let changed = false;

		if (!Array.isArray(headers)) {
			headers = Object.entries(headers);
		}

		for (const [key, value] of headers) {
			if (newResponse.headers.get(key) !== value) {
				newResponse.headers.set(key, value);
				changed = true;
			}
		}

		if (changed) {
			return newResponse;
		}
	};
}
