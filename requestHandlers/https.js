export async function redirectHttps(url) {
	url.protocol = "https:";
	return Response.redirect(url, 301);
}
