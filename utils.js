export function toArray(mixed) {
	return Array.isArray(mixed) ? mixed : [mixed];
}

export function redirect(url, status = 302) {
	const response = Response.redirect(`${url}`, status);

	return new Response(response.body, response);
}