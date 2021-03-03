export default function redirect(code = 302) {
	return async ({ request }) => {
		return Response.redirect(request.url, code);
	};
}
