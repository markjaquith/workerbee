import setProtocol from './setProtocol';

const REQUEST = {
	request: new Request('https://example.com/'),
};

const HTTP = 'http';

test('setProtocol()', async () => {
	const result = await setProtocol(HTTP)(REQUEST);
	const url = new URL(result.url);
	expect(url.protocol).toBe(`${HTTP}:`);
});
