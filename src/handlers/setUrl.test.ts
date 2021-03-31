import setUrl from './setUrl'

const LOCATION = 'https://example.com/path/?foo=bar'
const NEW_LOCATION = 'https://markjaquith.com/path/?foo=bar'
const REQUEST = {
	request: new Request(LOCATION),
}

test('setUrl()', async () => {
	const result = await setUrl(NEW_LOCATION)(REQUEST)
	expect(new URL(result.url).toString()).toBe(NEW_LOCATION)
})
