import MethodRouter from './MethodRouter'

const CONNECT = 'CONNECT'
const DELETE = 'DELETE'
const GET = 'GET'
const HEAD = 'HEAD'
const OPTIONS = 'OPTIONS'
const PATCH = 'PATCH'
const POST = 'POST'
const PUT = 'PUT'
const TRACE = 'TRACE'
const ALL = 'ALL' // Special one.

const METHODS = [CONNECT, DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT, TRACE]

function makeRequest(method: string): Request {
	return new Request('https://example.com/', {
		method,
	})
}

describe('MethodRouter', () => {
	test('GET does not match POST', () => {
		const router = new MethodRouter(GET)
		expect(router.matches(makeRequest(POST))).toBe(false)
	})

	for (const method of METHODS) {
		test(`${method} matches ${method}`, () => {
			const router = new MethodRouter(method)
			expect(makeRequest(method).method).toBe(method)
			expect(router.matches(makeRequest(method))).toBe(true)
			expect(router.matches(makeRequest(method.toLowerCase()))).toBe(true)
		})
		test(`${method} matches ALL`, () => {
			const router = new MethodRouter(ALL)
			expect(router.matches(makeRequest(method.toLowerCase()))).toBe(true)
		})
	}
})
