import setPath from './setPath'
import RequestManager from '../RequestManager'

describe('setPath', () => {
	test('Updates the path', async () => {
		const manager = new RequestManager().makeData({
			request: new Request('https://example.com/'),
		})
		const path = '/foo'
		const result = await setPath(path)(manager)
		const url = new URL(result.url)
		expect(url.pathname).toBe(path)
	})
})
