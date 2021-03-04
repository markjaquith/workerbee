import removeStartingPath from './removeStartingPath';

const REQUEST = {
	request: new Request('https://example.com/foo/path/?foo=bar'),
};

test('removeStartingPath()', async () => {
	const result = await removeStartingPath('/foo')(REQUEST);
	expect(new URL(result.url).pathname).toBe('/path/');
});
