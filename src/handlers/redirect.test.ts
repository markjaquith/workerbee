import redirect from './redirect';

const LOCATION = 'https://example.com/path/?foo=bar';
const REQUEST = {
	request: new Request(LOCATION),
};

describe('redirect()', () => {
	test('redirect(301)', async () => {
		const result = await redirect(301)(REQUEST);
		expect(result).toBeInstanceOf(Response);
		expect(result.status).toBe(301);
		expect(result.headers.get('location')).toBe(LOCATION);
	});

	test('redirect(302)', async () => {
		const result = await redirect(302)(REQUEST);
		expect(result).toBeInstanceOf(Response);
		expect(result.status).toBe(302);
		expect(result.headers.get('location')).toBe(LOCATION);
	});

	test('redirect()', async () => {
		const result = await redirect()(REQUEST);
		expect(result).toBeInstanceOf(Response);
		expect(result.status).toBe(302);
		expect(result.headers.get('location')).toBe(LOCATION);
	});
});
