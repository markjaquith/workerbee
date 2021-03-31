import prependPath from './prependPath'

const REQUEST = {
	request: new Request('https://example.com/path/?foo=bar'),
}

test('prependPath()', async () => {
	const result = await prependPath('/foo')(REQUEST)
	expect(new URL(result.url).pathname).toBe('/foo/path/')
})
