import removePathPrefix from './removePathPrefix';

const REQUEST = {
	request: new Request('https://example.com/foo/path/?foo=bar'),
};

test('removePathPrefix()', async () => {
	const result = await removePathPrefix('/foo')(REQUEST);
	expect(new URL(result.url).pathname).toBe('/path/');
});
