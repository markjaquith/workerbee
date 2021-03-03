import setUrl from './setUrl';

export default function prependPath(path) {
	return async ({ request }) => {
		const url = new URL(request.url);
		url.pathname = path + url.pathname;

		return setUrl(url)({ request });
	};
}
