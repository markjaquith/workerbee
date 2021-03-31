import RequestManager from '../RequestManager'
import stripParamsForFetch from './stripParamsForFetch'

const DOMAIN = 'https://example.com'
const GET = 'GET'

function makeEvent(path = '/') {
	return {
		request: new Request(DOMAIN + path, {
			method: GET,
		}),
	}
}

interface Options {
	skipRedirect?: boolean
	noParams?: boolean
}

async function makeManager(
	path: string,
	options: Options = { skipRedirect: false, noParams: false },
) {
	const logUrl = jest.fn()
	const logRedirect = jest.fn()

	const earlyResponse = async () => new Response('Early')
	const redirect = async () => Response.redirect('https://example.org/')
	const manager = new RequestManager({
		request: [
			stripParamsForFetch(options.noParams ? undefined : ['foo', 'bar']),
			async ({ request: { url } }) => logUrl(url),
			options.skipRedirect ? earlyResponse : redirect,
		],
		response: [
			async ({ addResponseHandler }) => {
				addResponseHandler(async ({ response }) =>
					logRedirect(response.headers.get('location')),
				)
				return
			},
		],
	})

	await manager.makeResponse(makeEvent(path))
	return [logUrl, logRedirect]
}

describe('stripParamsForFetch', () => {
	test('Does nothing if no strippable params are passed', async () => {
		const [logUrl] = await makeManager('/?baz=1')

		expect(logUrl).toHaveBeenCalledTimes(1)
		expect(logUrl).toHaveBeenLastCalledWith(DOMAIN + '/?baz=1')
	})

	test('Strips param if present', async () => {
		const [logUrl] = await makeManager('/?foo=1&baz=1&bar=1')

		expect(logUrl).toHaveBeenCalledTimes(1)
		expect(logUrl).toHaveBeenLastCalledWith(DOMAIN + '/?baz=1')
	})

	test('Reinjects params if redirect detected', async () => {
		const [logUrl, logRedirect] = await makeManager('/?foo=1&baz=1&bar=1')

		expect(logUrl).toHaveBeenCalledTimes(1)
		expect(logUrl).toHaveBeenLastCalledWith(DOMAIN + '/?baz=1')
		expect(logRedirect).toHaveBeenCalledTimes(1)
		expect(logRedirect).toHaveBeenLastCalledWith(
			'https://example.org/?foo=1&bar=1',
		)
	})

	test('Does not reinject params if redirect detected but params were not stripped', async () => {
		const [logUrl, logRedirect] = await makeManager('/?baz=1')

		expect(logUrl).toHaveBeenCalledTimes(1)
		expect(logUrl).toHaveBeenLastCalledWith(DOMAIN + '/?baz=1')
		expect(logRedirect).toHaveBeenCalledTimes(1)
		expect(logRedirect).toHaveBeenLastCalledWith('https://example.org/')
	})

	test('No redirect branch', async () => {
		const [logUrl, logRedirect] = await makeManager('/?baz=1&bar=1', {
			skipRedirect: true,
		})

		expect(logUrl).toHaveBeenCalledTimes(1)
		expect(logUrl).toHaveBeenLastCalledWith(DOMAIN + '/?baz=1')
		expect(logRedirect).toHaveBeenCalledTimes(1)
		expect(logRedirect).toHaveBeenLastCalledWith(null)
	})

	test('Strips UTMs by default', async () => {
		const [logUrl, logRedirect] = await makeManager('/?utm_source=source', {
			skipRedirect: true,
			noParams: true,
		})

		expect(logUrl).toHaveBeenCalledTimes(1)
		expect(logUrl).toHaveBeenLastCalledWith(DOMAIN + '/')
		expect(logRedirect).toHaveBeenCalledTimes(1)
		expect(logRedirect).toHaveBeenLastCalledWith(null)
	})
})
