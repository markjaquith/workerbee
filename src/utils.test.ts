import {
	withCurrent,
	curryWithCurrent,
	transformLastArgument,
	matchesValue,
	toArray,
	getCookie,
	withRequest,
	withResponse,
} from './utils'

const RESULT = new Request('https://example.com/')

describe('with*() and curryWithCurrent()', () => {
	let CURRENT, INPUT, inOut, threeArgs

	beforeAll(() => {
		CURRENT = new Request('https://example.com/')
		INPUT = {
			current: CURRENT,
			request: new Request('https://no.com/'),
			response: new Response('no'),
		}

		inOut = async function (input) {
			return input
		}

		threeArgs = async function (
			_one: any,
			_two: any,
			current: any,
		): Promise<Request> {
			return current
		}
	})

	test('withCurrent() returns request from the last argument called', async () => {
		expect(await inOut(INPUT)).not.toBe(CURRENT)
		expect(await threeArgs('one', 'two', INPUT)).not.toBe(CURRENT)
		expect(await withCurrent(inOut)(INPUT)).toBe(CURRENT)
		expect(await withCurrent(threeArgs)('one', 'two', INPUT)).toBe(CURRENT)
	})

	test('withRequest() returns request from the last argument called', () => {
		const fn = (_a: any, b: any) => b
		expect(withRequest(fn)('a', { request: 'request' })).toBe('request')
	})

	test('withResponse() returns response from the last argument called', () => {
		const fn = (_a: any, b: any) => b
		expect(withResponse(fn)('a', { response: 'response' })).toBe('response')
	})

	test('curryWithCurrent() returns current fron the last arg, with currying', async () => {
		expect(await curryWithCurrent(threeArgs)('one', 'two', INPUT)).toBe(CURRENT)
		expect(await curryWithCurrent(threeArgs)('one')('two')(INPUT)).toBe(CURRENT)
	})
})

describe('transformLastArgument()', () => {
	const makeZ = () => 'z'

	test('0 args', () => {
		expect(transformLastArgument(makeZ, () => 'result')()).toBe('result')
	})

	test('1 arg', () => {
		expect(transformLastArgument(makeZ, (z) => z)('a')).toBe('z')
	})

	test('2 args', () => {
		expect(transformLastArgument(makeZ, (_a, z) => z)('a', 'b')).toBe('z')
	})

	test('3 args', () => {
		expect(transformLastArgument(makeZ, (_a, _b, z) => z)('a', 'b', 'c')).toBe(
			'z',
		)
	})

	test('4 args', () => {
		expect(
			transformLastArgument(makeZ, (_a, _b, _c, z) => z)('a', 'b', 'c', 'd'),
		).toBe('z')
	})

	test('5 args', () => {
		expect(
			transformLastArgument(makeZ, (_a, _b, _c, _d, z) => z)(
				'a',
				'b',
				'c',
				'd',
				'e',
			),
		).toBe('z')
	})

	test('6 args (throws exception)', () => {
		// @ts-ignore
		expect(() =>
			// @ts-ignore (I am adding an extra argument on purpose).
			transformLastArgument(
				makeZ,
				(_a: any, _b: any, _c: any, _d: any, _e: any, z: any) => z,
			)('a', 'b', 'c', 'd', 'e'),
		).toThrow()
	})
})

describe('matchesValue()', () => {
	test('can match a single value matcher', () => {
		const startsWithA = (str: string) => str.startsWith('A')
		const endsWithZ = (str: string) => str.endsWith('Z')
		expect(matchesValue(startsWithA, 'ABUZZ')).toBe(true)
		expect(matchesValue(endsWithZ, 'ABUZZ')).toBe(true)
		expect(matchesValue(startsWithA, 'ZEBRA')).toBe(false)
		expect(matchesValue(endsWithZ, 'ZEBRA')).toBe(false)
	})

	test('can match two combined value matchers', () => {
		const startsWithA = (str: string) => str.startsWith('A')
		const endsWithZ = (str: string) => str.endsWith('Z')
		expect(matchesValue([startsWithA, endsWithZ], 'ABUZZ')).toBe(true)
		expect(matchesValue([startsWithA, endsWithZ], 'ZEBRA')).toBe(false)
	})
})

describe('toArray()', () => {
	test('[]', () => {
		expect(toArray([])).toStrictEqual([])
	})

	test('string[]', () => {
		expect(toArray(['foo', 'bar'])).toStrictEqual(['foo', 'bar'])
	})

	test('{}', () => {
		expect(toArray({ foo: 'bar' })).toStrictEqual([{ foo: 'bar' }])
	})

	test('string', () => {
		expect(toArray('foo')).toStrictEqual(['foo'])
	})

	test('null', () => {
		expect(toArray(null)).toStrictEqual([])
	})

	test('undefined', () => {
		expect(toArray(undefined)).toStrictEqual([])
	})

	test('()', () => {
		expect(toArray()).toStrictEqual([])
	})

	test('{}.bar', () => {
		const foo = {}
		// @ts-ignore
		expect(toArray(foo.bar)).toStrictEqual([])
	})
})

describe('getCookie()', () => {
	let cookie, headers, request, requestWithNoCookies

	beforeAll(() => {
		cookie = 'name=Mark; eyes=blue'
		headers = new Headers()
		headers.set('cookie', cookie)
		request = new Request('https://example.com/', {
			method: 'GET',
			headers,
		})

		requestWithNoCookies = new Request('https://example.com/')
	})

	test('leading cookie', () => {
		expect(getCookie(request, 'eyes')).toBe('blue')
	})

	test('ending cookie', () => {
		expect(getCookie(request, 'name')).toBe('Mark')
	})

	test('missing cookie', () => {
		expect(getCookie(request, 'age')).toBeNull()
	})

	test('request with no cookie header', () => {
		expect(getCookie(requestWithNoCookies, 'name')).toBeNull()
	})
})
