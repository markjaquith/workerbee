import redirectHttps from './redirectHttps'
import RequestManager from '../RequestManager'

const GET = 'GET'

function makeEvent(url: string) {
	return {
		request: new Request(url, {
			method: GET,
		}),
	}
}

test('redirectHttps', async () => {
	const manager = new RequestManager({
		request: redirectHttps(),
	})

	const response = await manager.makeResponse(
		makeEvent('http://example.com/?foo=bar'),
	)
	expect(response.headers.get('location')).toBe('https://example.com/?foo=bar')
})
