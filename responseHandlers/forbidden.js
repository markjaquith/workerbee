export default async function forbidden() {
	return new Response("Sorry, this page is not available.", {
		status: 403,
		statusText: "Forbidden"
	});
}
