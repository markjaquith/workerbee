import { ManagerData } from '../RequestManager'

export default function redirect(code = 302) {
	return async ({ request }: ManagerData) => {
		return Response.redirect(request.url, code)
	}
}
