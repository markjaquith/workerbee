import removePathPrefix from './removePathPrefix';

const REQUEST = {
	request: new Request('https://example.com/foo/path/?foo=bar'),
};

describe('removePathPrefix()', () => {
	test('remove /foo from /foo/path/', async () => {
		const result = await removePathPrefix('/foo')(REQUEST);
		expect(new URL(result.url).pathname).toBe('/path/');
	});

	test('remove /bar from /foo/path/', async () => {
		const result = await removePathPrefix('/bar')(REQUEST);
		expect(result).toBeUndefined();
	});
});
