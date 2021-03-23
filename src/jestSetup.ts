import fetchMock from 'jest-fetch-mock';
import HTMLRewriter from './HTMLRewriter';

const globalAny: any = global;

fetchMock.enableMocks();

Response.redirect = (url: string, status: number = 302) =>
	new Response(null, {
		headers: {
			Location: url,
		},
		status,
	});

globalAny.HTMLRewriter = HTMLRewriter;
