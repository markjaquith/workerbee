import redirectHttp from './redirectHttp';
import RequestManager from '../RequestManager';

const GET = 'GET';

function makeEvent(url: string) {
	return {
		request: new Request(url, {
			method: GET,
		}),
	};
}

test('redirectHttp on https URLs', async () => {
	const manager = new RequestManager({
		request: redirectHttp(),
	});

	const response = await manager.makeResponse(
		makeEvent('https://example.com/?foo=bar'),
	);
	expect(response.headers.get('location')).toBe('http://example.com/?foo=bar');
});

test('redirectHttp does nothing on http URLs', async () => {
	const manager = new RequestManager({
		request: redirectHttp(),
	});

	const response = await manager.makeResponse(
		makeEvent('http://example.com/?foo=bar'),
	);
	expect(response.headers.get('location')).toBe(null);
});
