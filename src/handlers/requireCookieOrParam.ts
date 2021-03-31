import { getCookie } from '../utils'
import cookie from 'cookie'
import forbidden from './forbidden'
import { ManagerData } from '../RequestManager'

export default function requireCookieOrParam(
	name: string,
	message = 'Access denied',
) {
	return async function ({ request }: ManagerData) {
		const url = new URL(request.url)

		if (url.searchParams.has(name)) {
			url.searchParams.delete(name)
			let response = Response.redirect(url.toString(), 302)
			// The headers are read-only, so we reconstruct the response.
			response = new Response(response.body, response)
			response.headers.set(
				'Set-Cookie',
				cookie.serialize(name, '1', {
					httpOnly: true,
					path: '/',
				}),
			)

			return response
		} else if (!getCookie(request, name)) {
			return forbidden(message)()
		}
	}
}
