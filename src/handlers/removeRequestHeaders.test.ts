import removeRequestHeaders from './removeRequestHeaders'

const removeFooAndBarHeaders = removeRequestHeaders(['foo', 'bar'])

test('removeRequestHeaders() for existing headers', async () => {
	const request = new Request('https://example.com/', {
		headers: {
			foo: 'foo',
			bar: 'bar',
			baz: 'baz',
		},
	})

	expect(request.headers.has('foo')).toBe(true)
	expect(request.headers.has('bar')).toBe(true)
	expect(request.headers.has('baz')).toBe(true)

	const result = await removeFooAndBarHeaders({ request })
	expect(result.headers.has('foo')).toBe(false)
	expect(result.headers.has('bar')).toBe(false)
	expect(result.headers.has('baz')).toBe(true)
})

test('removeRequestHeaders() when headers are not present', async () => {
	const request = new Request('https://example.com/', {
		headers: {
			baz: 'baz',
		},
	})

	expect(request.headers.has('foo')).toBe(false)
	expect(request.headers.has('bar')).toBe(false)
	expect(request.headers.has('baz')).toBe(true)

	const result = await removeFooAndBarHeaders({ request })
	expect(result).toBeUndefined() // Because there was nothing to change.
})

test('removeRequestHeaders() called without headers', async () => {
	const removeNothing = removeRequestHeaders()
	const request = new Request('https://example.com/', {
		headers: {
			baz: 'baz',
		},
	})

	expect(request.headers.has('foo')).toBe(false)
	expect(request.headers.has('bar')).toBe(false)
	expect(request.headers.has('baz')).toBe(true)

	const result = await removeNothing({ request })
	expect(result).toBeUndefined() // Because there was nothing to change.
})
