import handleFetch, { header, startsWith, text } from './index'
import Text from './Text'

const USER_AGENT = 'User-Agent'
const userAgent = header(USER_AGENT)
const headers = new Headers()
headers.set(USER_AGENT, 'Googlebot 1.2')
const MANAGER = {
	current: {
		headers,
	},
}

test('Top level exports', () => {
	expect(userAgent(startsWith('Googlebot'))(MANAGER)).toBe(true)
})

test('text()', () => {
	expect(text('foo')).toBeInstanceOf(Text)
})

test('handleFetch()', async () => {
	const requestHandler = jest.fn().mockName('requestHandler')
	const genericRequestHandler = jest.fn().mockName('genericRequestHandler')

	const listener = handleFetch({
		request: genericRequestHandler,
		routes: (router) => {
			router.host('*.example.com', (router) => {
				router.get('/foo/:any*', requestHandler)
			})
		},
	})

	const fetchEvent = {
		respondWith: jest.fn(),
		passThroughOnException: jest.fn(),
		request: new Request('http://test.example.com/foo/bar/baz'),
	}

	await listener(fetchEvent)

	expect(fetchEvent.respondWith).toHaveBeenCalledTimes(1)
	expect(fetchEvent.passThroughOnException).toHaveBeenCalledTimes(1)
	expect(genericRequestHandler).toHaveBeenCalledTimes(1)
	expect(requestHandler).toHaveBeenCalledTimes(1)
})

test('handleFetch() with passThroughOnException false', async () => {
	const listener = handleFetch({
		passThroughOnException: false,
	})

	const fetchEvent = {
		respondWith: jest.fn(),
		passThroughOnException: jest.fn(),
		request: new Request('http://test.example.com/foo/bar/baz'),
	}

	await listener(fetchEvent)

	expect(fetchEvent.respondWith).toHaveBeenCalledTimes(1)
	expect(fetchEvent.passThroughOnException).not.toHaveBeenCalled()
})

test('handleFetch() with no arguments', async () => {
	const listener = handleFetch()

	const fetchEvent = {
		respondWith: jest.fn(),
		passThroughOnException: jest.fn(),
		request: new Request('http://test.example.com/foo/bar/baz'),
	}

	await listener(fetchEvent)

	expect(fetchEvent.respondWith).toHaveBeenCalledTimes(1)
	expect(fetchEvent.passThroughOnException).toHaveBeenCalledTimes(1)
})
