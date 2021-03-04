import setUrl from './setUrl';

export default function removePathPrefix(path: string) {
	return async ({ request }) => {
		const url = new URL(request.url);
		if (url.pathname.startsWith(path)) {
			url.pathname = url.pathname.substring(path.length);
			return setUrl(url)({ request });
		}
	};
}
