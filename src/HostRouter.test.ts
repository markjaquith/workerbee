import HostRouter from './HostRouter'

const exampleDotComRouter = new HostRouter('example.com')
const wildcardRouter = new HostRouter('*')
const wildcardDotExampleDotComRouter = new HostRouter('*.example.com')
const testDotWildCardDotComRouter = new HostRouter('test.*.com')
const wildcardExampleDotComRouter = new HostRouter('*example.com')

describe('HostRouter', () => {
	test('example.com', () => {
		expect(
			exampleDotComRouter.matches(new Request('https://example.com/foo')),
		).toBe(true)
		expect(
			exampleDotComRouter.matches(new Request('https://markjaquith.com/foo')),
		).toBe(false)
	})

	test('*.example.com', () => {
		expect(
			wildcardDotExampleDotComRouter.matches(
				new Request('https://foo.example.com/bar'),
			),
		).toBe(true)
		expect(
			wildcardDotExampleDotComRouter.matches(
				new Request('http://example.com/foo'),
			),
		).toBe(false)
	})

	test('test.*.com', () => {
		expect(
			testDotWildCardDotComRouter.matches(
				new Request('https://test.example.com/foo'),
			),
		).toBe(true)
		expect(
			testDotWildCardDotComRouter.matches(
				new Request('https://example.test.foo.com/nope'),
			),
		).toBe(false)
	})

	test('*example.com', () => {
		expect(
			wildcardExampleDotComRouter.matches(
				new Request('https://foo.example.com/bar'),
			),
		).toBe(true)
		expect(
			wildcardExampleDotComRouter.matches(
				new Request('https://example.com/bar'),
			),
		).toBe(true)
		expect(
			wildcardExampleDotComRouter.matches(
				new Request('https://example.test.com/bar'),
			),
		).toBe(false)
	})

	test('*', () => {
		expect(wildcardRouter.matches(new Request('https://example.com/'))).toBe(
			true,
		)
	})
})
