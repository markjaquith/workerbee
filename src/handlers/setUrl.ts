type Stringable = {
	toString(): string;
};

export default function setUrl(url: string | Stringable) {
	url = typeof url.toString === 'function' ? url.toString() : url;

	return async ({ request }) => {
		return new Request(url as string, {
			body: request.body,
			headers: request.headers,
			method: request.method,
			redirect: request.redirect,
		});
	};
}
