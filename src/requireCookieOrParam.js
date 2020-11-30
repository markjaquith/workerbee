import { getCookie, redirect } from './utils';
import cookie from 'cookie';

export default function requireCookieOrParam(name, message = 'Access denied') {
	return async function({ request }) {
		const url = new URL(request.url);

		if (url.searchParams.has(name)) {
			url.searchParams.delete(name);
			let response = redirect(url, 302);
			response.headers.set(
				'Set-Cookie',
				cookie.serialize(name, '1', {
					httpOnly: true,
					path: '/',
				})
			);

			return response;
		} else if (!getCookie(request, name)) {
			return new Response(message, {
				status: '403',
				statusText: 'Forbidden',
			});
		}
	}
}