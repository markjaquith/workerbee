import setHost from './setHost'

const LOCATION = 'https://example.com/path/?foo=bar'
const NEW_LOCATION = 'https://markjaquith.com/path/?foo=bar'
const NEW_HOST = 'markjaquith.com'
const REQUEST = {
	request: new Request(LOCATION),
}

test('setHost()', async () => {
	const result = await setHost(NEW_HOST)(REQUEST)
	expect(new URL(result.url).toString()).toBe(NEW_LOCATION)
})
