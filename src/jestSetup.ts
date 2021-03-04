import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

Response.redirect = (url: string, status: number = 302) =>
	new Response(null, {
		headers: new Headers({
			Location: url,
		}),
		status,
	});
