import { redirect } from '../utils.js';

const HTTPS = 'https:';

export default async function redirectHttps({ request }) {
	const url = new URL(request.url);

	if (url.protocol !== HTTPS) {
		url.protocol = HTTPS;
		return redirect(url, 301);
	}

	return request;
}
